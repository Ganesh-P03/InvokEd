from flask import Flask, request, jsonify
import chromadb
import pandas as pd
import uuid

app = Flask(__name__)

class Api:
    def __init__(self, file_path="my_api_endpoints.csv"):
        self.file_path = file_path
        self.data = pd.read_csv(file_path)
        self.chroma_client = chromadb.PersistentClient("vectorstore")
        self.collection = self.chroma_client.get_or_create_collection(name="api_endpoints")
        self.load_portfolio()

    def load_portfolio(self):
        if not self.collection.count():
            for _, row in self.data.iterrows():
                self.collection.add(
                    documents=[row["Description"]],
                    metadatas=[{"url": row["url"], "variables": row["variables"]}],
                    ids=[str(uuid.uuid4())]
                )

    def query_links(self, text):
        results = self.collection.query(query_texts=[text], n_results=1).get("metadatas", [])
        return results[0] if results else {"error": "No matching API found"}

api_handler = Api()

@app.route("/api", methods=["POST"])
def get_api():
    data = request.json
    query_text = data.get("query", "")
    if not query_text:
        return jsonify({"error": "No text provided"}), 400
    
    response = api_handler.query_links(query_text)
    return jsonify(response)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)