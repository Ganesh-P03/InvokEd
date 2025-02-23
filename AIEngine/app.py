from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
import chromadb
import pandas as pd
import uuid
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows all origins
load_dotenv()

llm = ChatGroq(
    temperature=0,
    model_name="llama-3.3-70b-versatile",
)

# Predefine the prompt template and chain
prompt = PromptTemplate.from_template(
    """
    You are an intelligent data extractor. Given the following text, extract the required fields listed below.
    
    - Ensure the response is **strictly formatted** as a JSON object without any additional text.
    - Match the extracted fields to the dataset provided below.
    - If a field is missing or not explicitly stated, return the **first available value** from the corresponding dataset instead of guessing.
    
    **Fields to Extract:** {fields}
    
    **Dataset for Reference:**
    - ClassroomIDs: ['7A', '7B', '8A', '8B', '9A'] (Default: '7A')
    - SubjectIDs: ['Mathematics', 'Science', 'Social', 'Physics', 'Chemistry'] (Default: 'Mathematics')
    - StudentIDs: ['S001', 'S002', 'S003', 'S004', 'S005', 'S006', 'S007', 'S008', 'S009', 'S010'] (Default: 'S001')
    
    **Text to Process:**
    {text}
    
    **Output Format (STRICT JSON, NO EXTRA TEXT):**
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
                    metadatas=[{
                        "url": row["url"], 
                        "variables": row["variables"],
                        "isFrontend": row["isFrontend"]
                    }],
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
        url, fields, is_frontend = metadata["url"], metadata["variables"], metadata["isFrontend"]

        extracted_data = {}
        if fields and fields != "[]":
            response = chain.invoke(input={"fields": fields, "text": text})
            try:
                extracted_data = json_parser.parse(response.content)
            except OutputParserException:
                return {"error": "Context too large. Unable to parse response."}

            # Replace only the last occurrence of each placeholder
            for key, value in extracted_data.items():
                if key in url:
                    url = url.rsplit(key, 1)  # Split at the last occurrence
                    url = f"{url[0]}{value}{url[1]}" if len(url) > 1 else f"{url[0]}{value}"

        return {"url": url, "data": extracted_data, "isFrontend": is_frontend}

api_handler = ApiHandler()

@app.route("/api", methods=["POST"])
def get_api():
    data = request.json
    query_text = data.get("query", "").strip()
    
    if not query_text:
        return jsonify({"error": "No text provided"}), 400
    
    response = api_handler.query_api(query_text)
    return jsonify(response)

# Insights generation prompt
insights_prompt = PromptTemplate.from_template(
    """
    You are an analyst. Now analyze the following data and give the top 3 useful insights.
    Ensure the response is strictly formatted as a JSON object.
    
    JSON Format:
    {{
        "1": "<>",
        "2": "<>",
        "3": "<>"
    }}


    Data:
    {text}
    
    ### JSON OUTPUT (STRICT FORMAT, NO EXTRA TEXT):
    """
)
insights_chain = insights_prompt | llm

@app.route("/insights", methods=["POST"])
def get_insights():  # Renamed function to avoid conflicts
    data = request.json
    query_text = data.get("text", "")  # Fixed key to match input JSON
    query_text = str(query_text)
    
    if not query_text:
        return jsonify({"error": "No text provided"}), 400
    
    response = insights_chain.invoke(input={"text": query_text})  # Fixed input key
    
    try:
        # Extract LLM response content
        response_content = response.content if hasattr(response, "content") else str(response)

        extracted_data = json_parser.parse(response_content)
    except OutputParserException:
        return jsonify({"error": "Context too large. Unable to parse response."}), 400

    return jsonify(extracted_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8888, debug=True)
