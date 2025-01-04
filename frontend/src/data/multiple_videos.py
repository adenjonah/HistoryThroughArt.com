import json

# Load the JSON data from the file
with open('artworks.json', 'r') as f:
    artworks = json.load(f)

def find_pieces_with_more_than_one_video(artworks):
    pieces_with_more_than_one_video = []

    for artwork in artworks:
        # Check if videoLink exists and has more than one entry
        video_links = artwork.get('videoLink')
        if video_links and len(video_links) > 1:
            pieces_with_more_than_one_video.append({
                'id': artwork.get('id'),
                'name': artwork.get('name'),
                'video_links': video_links
            })

    return pieces_with_more_than_one_video

# Run the check
pieces_with_more_than_one_video = find_pieces_with_more_than_one_video(artworks)

# Print the artworks with more than one video link
if pieces_with_more_than_one_video:
    print("The following artworks have more than one video link:")
    for artwork in pieces_with_more_than_one_video:
        print(f"Artwork ID: {artwork['id']}, Name: {artwork['name']}, Videos: {artwork['video_links']}")
else:
    print("No artworks have more than one video link.")