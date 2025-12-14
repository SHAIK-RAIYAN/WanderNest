# import os
# import random
# import sys
# from pathlib import Path

# import pandas as pd
# import pymongo
# import dotenv

# dotenv.load_dotenv()

# BASE_DIR = Path(__file__).resolve().parent
# DEFAULT_CSV = BASE_DIR / "goibibo_com-travel_sample.csv"
# COLLECTION_NAME = "listings"

# def get_random_image():
#     placeholder_images = [
#         {
#             "filename": "listingimage",
#             "url": "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
#         },
#         {
#             "filename": "listingimage",
#             "url": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
#         },
#         {
#             "filename": "listingimage",
#             "url": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
#         },
#         {
#             "filename": "listingimage",
#             "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
#         },
#         {
#             "filename": "listingimage",
#             "url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
#         },
#     ]
#     return random.choice(placeholder_images)

# def clean_data(value, default, data_type=float):
#     if pd.isna(value):
#         return default
#     try:
#         if data_type == float:
#             return float(value)
#         if data_type == int:
#             return int(float(value))
#         if data_type == str:
#             return str(value)
#     except (ValueError, TypeError):
#         return default
#     return default

# def get_facilities_array(facilities_str):
#     if pd.isna(facilities_str) or not isinstance(facilities_str, str):
#         return []
#     return [facility.strip() for facility in facilities_str.split("|")]

# def resolve_csv_path():
#     if len(sys.argv) > 1:
#         return Path(sys.argv[1]).expanduser().resolve()
#     env_path = os.getenv("CSV_FILE_PATH")
#     if env_path:
#         return Path(env_path).expanduser().resolve()
#     return DEFAULT_CSV

# def get_database(client):
#     # Use a fixed database name as requested (no env)
#     return client["wandernest_db"]

# def seed_database():
#     # Hardcoded MongoDB connection string as requested (no env)
#     mongo_uri = "mongodb+srv://shaikraiyan2005:1QaCY73KTMkSkbYk@wandernestcluster.b37zrwv.mongodb.net/?appName=WanderNestCluster"

#     csv_path = resolve_csv_path()
#     if not csv_path.exists():
#         print(f"Error: CSV file not found at '{csv_path}'.")
#         sys.exit(1)

#     try:
#         client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
#         client.server_info()
#     except pymongo.errors.ConnectionFailure as e:
#         print(f"Error: Could not connect to MongoDB: {e}")
#         sys.exit(1)

#     db = get_database(client)

#     collection = db[COLLECTION_NAME]

#     try:
#         df = pd.read_csv(csv_path)
#     except Exception as err:
#         client.close()
#         print(f"Error: Failed to read CSV file '{csv_path}': {err}")
#         sys.exit(1)

#     listings_to_insert = []
#     for _, row in df.iterrows():
#         if pd.isna(row.get("latitude")) or pd.isna(row.get("longitude")):
#             continue

#         new_listing = {
#             "title": clean_data(row.get("property_name"), "No Title", str),
#             "description": clean_data(row.get("hotel_description"), "No description available.", str),
#             "image": get_random_image(),
#             "price": random.randint(1500, 15000),
#             "location": clean_data(row.get("city"), "Unknown Location", str),
#             "country": clean_data(row.get("country"), "India", str),
#             "geometry": {
#                 "type": "Point",
#                 "coordinates": [
#                     clean_data(row.get("longitude"), 0.0, float),
#                     clean_data(row.get("latitude"), 0.0, float),
#                 ],
#             },
#             "rating": clean_data(row.get("site_review_rating"), 0.0, float),
#             "reviewCount": clean_data(row.get("site_review_count"), 0, int),
#             "starRating": clean_data(row.get("hotel_star_rating"), 0, int),
#             "facilities": get_facilities_array(row.get("hotel_facilities")),
#             "reviews": [],
#         }
#         listings_to_insert.append(new_listing)

#     if not listings_to_insert:
#         client.close()
#         print("No valid listings formatted for insertion.")
#         return

#     try:
#         print(f"Clearing existing data from '{COLLECTION_NAME}'...")
#         collection.delete_many({})

#         print(f"Inserting {len(listings_to_insert)} new listings...")
#         collection.insert_many(listings_to_insert, ordered=False)

#         print("Database seeding completed successfully.")
#     except pymongo.errors.BulkWriteError as bwe:
#         print(f"Bulk write error: {bwe.details}")
#     except Exception as err:
#         print(f"An error occurred during database operations: {err}")
#     finally:
#         client.close()

# if __name__ == "__main__":
#     seed_database()




import os
import random
import sys
from pathlib import Path

import pandas as pd
import pymongo
import dotenv

dotenv.load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_CSV = BASE_DIR / "goibibo_com-travel_sample.csv"
COLLECTION_NAME = "listings"

# --- NEW IMAGE REPOSITORY ---
# We now have categorized image pools.
IMAGE_POOLS = {
    "mountain": [
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
    ],
    "beach": [
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
    ],
    "city": [
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
    ],
    "resort": [
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
    ],
    "homestay": [
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
    ],
    "generic_hotel": [
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
        {"filename": "listingimage", "url": "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"},
    ],
}

# --- KEYWORD MAPPING ---
# Maps keywords found in the data to our image pools.
KEYWORD_TO_POOL = {
    # Cities
    "manali": "mountain",
    "shimla": "mountain",
    "darjeeling": "mountain",
    "mussoorie": "mountain",
    "srinagar": "mountain",
    "goa": "beach",
    "puri": "beach",
    "pondicherry": "beach",
    "kovalam": "beach",
    "mumbai": "city",
    "delhi": "city",
    "new delhi": "city",
    "bangalore": "city",
    "chennai": "city",
    "kolkata": "city",
    "jaipur": "city",
    # Property Types
    "resort": "resort",
    "homestay": "homestay",
    "villa": "homestay",
    "hotel": "generic_hotel",
}

def get_categorized_image(location, title, property_type):
    """Intelligently selects an image based on listing data."""
    text_to_check = f"{location} {title} {property_type}".lower()

    # Check keywords in order of priority
    for keyword, pool_name in KEYWORD_TO_POOL.items():
        if keyword in text_to_check:
            return random.choice(IMAGE_POOLS[pool_name])
    
    # Fallback if no keywords match
    return random.choice(IMAGE_POOLS["generic_hotel"])


def clean_data(value, default, data_type=float):
    if pd.isna(value):
        return default
    try:
        if data_type == float:
            return float(value)
        if data_type == int:
            return int(float(value))
        if data_type == str:
            return str(value)
    except (ValueError, TypeError):
        return default
    return default

def get_facilities_array(facilities_str):
    if pd.isna(facilities_str) or not isinstance(facilities_str, str):
        return []
    return [facility.strip() for facility in facilities_str.split("|")]

def resolve_csv_path():
    if len(sys.argv) > 1:
        return Path(sys.argv[1]).expanduser().resolve()
    env_path = os.getenv("CSV_FILE_PATH")
    if env_path:
        return Path(env_path).expanduser().resolve()
    return DEFAULT_CSV

def get_database(client):
    # Use a fixed database name as requested (no env)
    return client["wandernest_db"]

def seed_database():
    # Hardcoded MongoDB connection string as requested (no env)
    mongo_uri = "mongodb+srv://shaikraiyan2005:1QaCY73KTMkSkbYk@wandernestcluster.b37zrwv.mongodb.net/?appName=WanderNestCluster"

    csv_path = resolve_csv_path()
    if not csv_path.exists():
        print(f"Error: CSV file not found at '{csv_path}'.")
        sys.exit(1)

    try:
        client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        client.server_info()
    except pymongo.errors.ConnectionFailure as e:
        print(f"Error: Could not connect to MongoDB: {e}")
        sys.exit(1)

    db = get_database(client)
    collection = db[COLLECTION_NAME]

    try:
        df = pd.read_csv(csv_path)
    except Exception as err:
        client.close()
        print(f"Error: Failed to read CSV file '{csv_path}': {err}")
        sys.exit(1)

    listings_to_insert = []
    for _, row in df.iterrows():
        if pd.isna(row.get("latitude")) or pd.isna(row.get("longitude")):
            continue
        
        # --- Cleaned data for image categorization ---
        title = clean_data(row.get("property_name"), "", str)
        location = clean_data(row.get("city"), "", str)
        prop_type = clean_data(row.get("property_type"), "", str)

        new_listing = {
            "title": title if title else "No Title",
            "description": clean_data(row.get("hotel_description"), "No description available.", str),
            "image": get_categorized_image(location, title, prop_type), # <-- Use new function
            "price": random.randint(1500, 15000),
            "location": location if location else "Unknown Location",
            "country": clean_data(row.get("country"), "India", str),
            "geometry": {
                "type": "Point",
                "coordinates": [
                    clean_data(row.get("longitude"), 0.0, float),
                    clean_data(row.get("latitude"), 0.0, float),
                ],
            },
            "rating": clean_data(row.get("site_review_rating"), 0.0, float),
            "reviewCount": clean_data(row.get("site_review_count"), 0, int),
            "starRating": clean_data(row.get("hotel_star_rating"), 0, int),
            "facilities": get_facilities_array(row.get("hotel_facilities")),
            "reviews": [],
        }
        listings_to_insert.append(new_listing)

    if not listings_to_insert:
        client.close()
        print("No valid listings formatted for insertion.")
        return

    try:
        print(f"Clearing existing data from '{COLLECTION_NAME}'...")
        collection.delete_many({})

        print(f"Inserting {len(listings_to_insert)} new listings...")
        collection.insert_many(listings_to_insert, ordered=False)

        print("Database seeding completed successfully.")
    except pymongo.errors.BulkWriteError as bwe:
        print(f"Bulk write error: {bwe.details}")
    except Exception as err:
        print(f"An error occurred during database operations: {err}")
    finally:
        client.close()

if __name__ == "__main__":
    seed_database()