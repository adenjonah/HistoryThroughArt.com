import json

# Load the JSON data from the file
with open('artworks.json', 'r') as f:
    artworks = json.load(f)

def check_missing_info(artworks):
    missing_info = []

    for artwork in artworks:
        missing_fields = []
        # Check if videoLink is missing or null
        if not artwork.get('videoLink'):
            missing_fields.append('videoLink')

        # Check if transcript is missing or null
        if not artwork.get('transcript'):
            missing_fields.append('transcript')

        # Check if location (displayedLocation or originatedLatitude and originatedLongitude) is missing
        if not artwork.get('displayedLocation') or \
           artwork.get('displayedLatitude') is None or \
           artwork.get('displayedLongitude') is None:
            missing_fields.append('displayedLocation')

        if missing_fields:
            missing_info.append({
                'id': artwork.get('id'),
                'name': artwork.get('name'),
                'missing_fields': missing_fields
            })

    return missing_info

# Run the check
missing_info = check_missing_info(artworks)

# Print the missing information
if missing_info:
    print("The following artworks have missing information:")
    for artwork in missing_info:
        print(f"Artwork ID: {artwork['id']}, Name: {artwork['name']}, Missing: {', '.join(artwork['missing_fields'])}")
else:
    print("All artworks have the required information.")