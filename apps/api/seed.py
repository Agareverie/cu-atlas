from pymongo import MongoClient
from buildings import building_data

client = MongoClient("mongodb://localhost:27017/")
db = client["cu_atlas_db"]

buildings = db["buildings"]
routes = db["routes"]

# Drop the initial databases
buildings.drop()
routes.drop()

print("Seeding buildings...")
buildings.create_index([("geometry", "2dsphere")])
buildings.create_index("code", unique=True)
buildings.insert_many(building_data)

client.close()
print("Database seeded successfully")
