from pymongo import MongoClient
import logging

# Set up logging
logger = logging.getLogger(__name__)

# MongoDB connection
try:
    client = MongoClient('mongodb://localhost:27017/')
    db = client['sns-cce']
    users_collection = db['users']
    admins_collection = db['admins']
    jobs_collection = db['jobs']
    saved_jobs_collection = db['saved_jobs']
except Exception as e:
    logger.error(f"MongoDB connection error: {str(e)}")
    raise 