import os
import random
import sys
import json
from pathlib import Path
import pymongo
import dotenv
from bson import ObjectId

dotenv.load_dotenv()


BASE_DIR = Path(__file__).resolve().parent
MODE = "JSON" 
JSON_FILE = BASE_DIR / "booking_data.json"
CSV_FILE = BASE_DIR / "goibibo_com-travel_sample.csv"
COLLECTION_NAME = "listings"
DEFAULT_COUNTRY = "India"
MONGO_URI = os.getenv("ATLAS_DB_URL")
DB_NAME = "wandernest_db"


ADMIN_ID = ObjectId("687a7f847d667104c4037a6b") 

def get_voyager_image(item):
    """Extracts the best image from Voyager JSON data."""
    
    if "images" in item and item["images"]:
        first_img = item["images"][0]
        if isinstance(first_img, str): return first_img
        if isinstance(first_img, dict): return first_img.get("url") or first_img.get("link")
    
    # Fallback to 'image' string
    if "image" in item and isinstance(item["image"], str): return item["image"]
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3" # Ultimate fallback

def get_voyager_price(item):
    """Cleans and extracts price."""
    price = item.get("price") or item.get("minPrice")
    # Fallback price logic if missing
    if not price: 
        stars = item.get("stars")
        if stars == 5: return random.randint(8000, 25000)
        if stars == 4: return random.randint(5000, 10000)
        return random.randint(2500, 8000)
    
    try:
        if isinstance(price, str):
            clean = price.replace("₹", "").replace(",", "").replace("Rs", "").strip()
            return int(float(clean))
        return int(float(price))
    except:
        return random.randint(3000, 15000)

def get_random_india_coords():
    """Generates random coordinates roughly within India to save listings without map data."""
    # Latitude: 8.0 (South) to 30.0 (North)
    # Longitude: 70.0 (West) to 88.0 (East)
    lat = random.uniform(8.5, 30.0)
    lng = random.uniform(70.0, 88.0)
    return lat, lng

def seed_database():
    try:
        client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=30000)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
    except Exception as e:
        print(f"Error connecting to DB: {e}")
        sys.exit(1)

    listings_to_insert = []
    
    if MODE == "JSON":
        print(f"Reading JSON (Real Data): {JSON_FILE}")
        if not JSON_FILE.exists():
            print(f"❌ Error: {JSON_FILE} not found.")
            sys.exit(1)

        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        print(f"Processing {len(data)} items...")
        
        
        if len(data) > 0:
            print(f"DEBUG: First item keys: {list(data[0].keys())}")

        for item in data:
            
            lat = item.get("latitude")
            lng = item.get("longitude")
            
            
            if not lat and "location" in item and isinstance(item["location"], dict):
                lat = item["location"].get("lat")
                lng = item["location"].get("lng")
            
            
            if not lat or not lng:
                lat, lng = get_random_india_coords()

            # 2. Image Check
            image_url = get_voyager_image(item)
            if not image_url: continue 

            # 3. Address Logic
            address = item.get("address")
            location_str = "India"
            if isinstance(address, dict):
                location_str = address.get("city") or address.get("full") or "India"
            elif isinstance(address, str):
                location_str = address

            new_listing = {
                "title": item.get("title") or item.get("name") or "Beautiful Stay",
                "description": item.get("description", "Experience a luxury stay with top-tier amenities."),
                "image": {
                    "filename": "booking_import",
                    "url": image_url
                },
                "price": get_voyager_price(item),
                "location": location_str,
                "country": DEFAULT_COUNTRY,
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(lng), float(lat)],
                },
                "owner": ADMIN_ID,
                "reviews": []
            }
            listings_to_insert.append(new_listing)

    elif MODE == "CSV":
        print("Switch MODE to JSON inside script to use this.")
        return

    if not listings_to_insert:
        print("No valid listings found. Check DEBUG output above.")
        return

    print(f"Clearing existing collection...")
    collection.delete_many({})
    
    print(f"Inserting {len(listings_to_insert)} High-Quality listings...")
    collection.insert_many(listings_to_insert, ordered=False)
    print("✅ Success! Database seeded.")
    client.close()

if __name__ == "__main__":
    seed_database()