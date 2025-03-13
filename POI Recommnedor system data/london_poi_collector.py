import requests
import pandas as pd
import time
import os

# Your API key
API_KEY = "AIzaSyCFxnBkDzZL2U3icD5Wdx685olZy71X7tg"

# Define London areas
london_areas = [
    {"name": "Central London", "lat": 51.5074, "lng": -0.1278},
    {"name": "Westminster", "lat": 51.4975, "lng": -0.1357},
    {"name": "Camden", "lat": 51.5390, "lng": -0.1426},
    {"name": "Kensington", "lat": 51.5015, "lng": -0.1946},
    {"name": "Greenwich", "lat": 51.4810, "lng": -0.0052},
    {"name": "Shoreditch", "lat": 51.5229, "lng": -0.0777}
]

# Define POI types
poi_types = [
    "tourist_attraction",
    "museum",
    "art_gallery",
    "park",
    "historic_site",
    "church",
    "theater",
    "zoo",
    "aquarium",
    "amusement_park",
    "restaurant"
]

# Function to get nearby places
def get_nearby_places(location, radius=3000, place_type="tourist_attraction"):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{location['lat']},{location['lng']}",
        "radius": radius,
        "type": place_type,
        "key": API_KEY
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    results = data.get('results', [])
    
    # Handle pagination if there are more results
    while 'next_page_token' in data:
        # Need to wait before using next_page_token
        time.sleep(2)
        params['pagetoken'] = data['next_page_token']
        response = requests.get(url, params=params)
        data = response.json()
        results.extend(data.get('results', []))
    
    return results

# Process results into a table
def extract_basic_info(places, area_name, place_type):
    extracted = []
    for place in places:
        extracted.append({
            "place_id": place.get("place_id"),
            "name": place.get("name"),
            "area": area_name,
            "type_queried": place_type,
            "latitude": place.get("geometry", {}).get("location", {}).get("lat"),
            "longitude": place.get("geometry", {}).get("location", {}).get("lng"),
            "types": ",".join(place.get("types", [])),
            "rating": place.get("rating"),
            "user_ratings_total": place.get("user_ratings_total"),
            "vicinity": place.get("vicinity"),
            "price_level": place.get("price_level")
        })
    return extracted

# Create output directory
os.makedirs("london_data", exist_ok=True)

# Collect data for all areas and types
all_places = []
place_ids = set()  # To track unique places and avoid duplicates

for area in london_areas:
    print(f"\nCollecting data for {area['name']}...")
    
    for poi_type in poi_types:
        print(f"  Searching for {poi_type}...")
        
        try:
            # Get places for this area and type
            places = get_nearby_places(area, place_type=poi_type)
            
            # Filter out duplicates
            new_places = [p for p in places if p.get("place_id") not in place_ids]
            
            # Add new place_ids to our set
            place_ids.update([p.get("place_id") for p in new_places])
            
            # Extract and add to our collection
            extracted = extract_basic_info(new_places, area['name'], poi_type)
            all_places.extend(extracted)
            
            print(f"    Found {len(new_places)} new places")
            
            # Respect API rate limits
            time.sleep(1)
            
        except Exception as e:
            print(f"Error collecting {poi_type} in {area['name']}: {e}")

# Save all collected data
df = pd.DataFrame(all_places)
df.to_csv("london_data/london_pois_all.csv", index=False)
print(f"\nSaved {len(df)} total unique places to london_data/london_pois_all.csv")