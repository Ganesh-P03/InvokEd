from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
import chromadb
import pandas as pd
import uuid
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

llm = ChatGroq(
    temperature=0,
    model_name="llama-3.3-70b-versatile",
)

# Predefine the prompt template and chain
prompt = PromptTemplate.from_template(
    """
    Given the following text, extract the required fields listed below.
    Ensure the response is strictly formatted as a JSON object without any additional text.
    
    Fields to extract: {fields}
    
    Text:
    {text}
    
    ### JSON OUTPUT (STRICT FORMAT, NO EXTRA TEXT):
    """
)

chain = prompt | llm
json_parser = JsonOutputParser()

class ApiHandler:
    def __init__(self, file_path="my_api_endpoints.csv", vector_store_path="vectorstore"):
        self.file_path = file_path
        self.data = pd.read_csv(file_path)
        self.chroma_client = chromadb.PersistentClient(vector_store_path)
        self.collection = self.chroma_client.get_or_create_collection(name="api_endpoints")
        self._load_collection()

    def _load_collection(self):
        """Loads data into the ChromaDB collection if it's empty."""
        if self.collection.count() == 0:
            for _, row in self.data.iterrows():
                self.collection.add(
                    documents=[row["Description"]],
                    metadatas=[{"url": row["url"], "variables": row["variables"]}],
                    ids=[str(uuid.uuid4())]
                )

    def query_api(self, text):
        """Queries the vector store and extracts relevant information."""
        results = self.collection.query(
            query_texts=[text], n_results=1, include=["documents", "metadatas"]
        )
        
        if not results["documents"]:
            return {"error": "No matching API found"}
        
        description = results["documents"][0][0]
        metadata = results["metadatas"][0][0]
        url, fields = metadata["url"], metadata["variables"]
        # return url,fields

        extracted_data = {}
        if fields and fields != "[]":
            response = chain.invoke(input={"fields": fields, "text": text})
            try:
                extracted_data = json_parser.parse(response.content)
            except OutputParserException:
                return {"error": "Context too large. Unable to parse response."}

            # Replace placeholders in URL with extracted values
            for key, value in extracted_data.items():
                url = url.replace(f"{key}", str(value))
        
        return {"url": url, "data": extracted_data}

api_handler = ApiHandler()

@app.route("/api", methods=["POST"])
def get_api():
    data = request.json
    query_text = data.get("query", "").strip()
    
    if not query_text:
        return jsonify({"error": "No text provided"}), 400
    
    response = api_handler.query_api(query_text)
    return jsonify(response)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
