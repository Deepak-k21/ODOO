from pymongo import MongoClient
from pymongo.database import Database
from .config import settings

client: MongoClient = None
db: Database = None

def connect_to_mongo():
    global client, db
    try:
        client = MongoClient(settings.MONGODB_URL)
        db = client[settings.MONGODB_DB_NAME]
        # Test connection
        client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        print(f"⚠️ MongoDB connection failed: {e}")
        print("📝 Using in-memory storage for demo mode")

def close_mongo_connection():
    global client
    if client:
        client.close()

def get_database() -> Database:
    return db
