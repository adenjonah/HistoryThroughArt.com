import json
import requests
import csv
import logging
from dotenv import load_dotenv
import os
import re

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Load the artworks.json file
with open('./artworks.json', 'r') as file:
    artworks = json.load(file)

# Define the API endpoint and headers
api_url = "https://api.openai.com/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {os.getenv('API_KEY')}",
    "Content-Type": "application/json"
}

# Prepare the CSV file
csv_file = 'corrections.csv'
csv_headers = ['ID', 'Correct', 'Incorrect Fields']

# Open the CSV file for writing
with open(csv_file, 'w', newline='') as file:
    writer = csv.writer(file, delimiter='|')
    writer.writerow(csv_headers)

    # Iterate over the first three items for testing
    for artwork in artworks:
        # Log the current ID being processed
        logging.debug(f"Processing artwork ID: {artwork['id']}")

        # Prepare the messages for the chat model, excluding the date field
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Please review the following artwork identifiers and return a JSON object with a boolean 'correct' indicating if all fields are correct, and an array 'incorrect_fields' listing any incorrect fields. Only return the JSON object without any explanation or additional text: {artwork['name']}, {artwork['location']}, {artwork['artist_culture']}, {artwork['materials']}."}
        ]

        # Prepare the request payload
        data = {
            "model": "gpt-4o",
            "messages": messages,
            "max_tokens": 150
        }

        # Send the request to the GPT-4o API
        response = requests.post(api_url, headers=headers, json=data)

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the response
            result = response.json()
            # Extract the text from the response
            correction = result.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
            logging.debug(f"Received correction: {correction}")

            # Attempt to parse the correction as JSON
            try:
                # Remove any backticks or code block markers
                correction_json = re.sub(r'```(?:json)?', '', correction).strip()
                correction_data = json.loads(correction_json)

                # Extract the required fields
                correct = correction_data.get('correct', False)
                incorrect_fields = correction_data.get('incorrect_fields', [])

                # Log the extracted data
                logging.debug(f"Parsed JSON: Correct={correct}, Incorrect Fields={incorrect_fields}")

                # Write to CSV only if there are incorrect fields
                if not correct:
                    writer.writerow([artwork['id'], correct, incorrect_fields])
            except json.JSONDecodeError:
                logging.error(f"Failed to parse JSON for artwork ID: {artwork['id']}")
        else:
            logging.error(f"Error: {response.status_code} - {response.text}")

logging.info(f"Corrections have been saved to {csv_file}")
