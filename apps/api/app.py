from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient()
db = client["cu_atlas_db"]

# Collections
buildings_collection = db["buildings"]

@app.route("/")
def hello():
    return {"message": "Hello from Flask"}

@app.route("/buildings", methods=["GET"])
def get_buildings():
    buildings_list = list(buildings_collection.find())
    for building in buildings_list:
        building["_id"] = str(building["_id"])
    if not buildings_list:
        return jsonify({"message": "Buildings not found", "buildings": []}), 200
    return jsonify({"message": "Buildings found", "buildings": buildings_list}), 200

if __name__ == "__main__":
    app.run(port=3000, debug=True)