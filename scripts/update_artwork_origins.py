#!/usr/bin/env python3
"""
Artwork Origin Location Updater

Uses OpenAI to research artwork origins and updates Sanity CMS.
Runs entirely outside Claude's context to avoid token limits.

Setup:
    pip install openai requests python-dotenv

Usage:
    # Set environment variables
    export SANITY_TOKEN=your_sanity_token
    export OPENAI_API_KEY=your_openai_key

    # Run the script
    python update_artwork_origins.py

    # Or dry run to preview changes
    python update_artwork_origins.py --dry-run

    # Process specific batch
    python update_artwork_origins.py --batch 1

    # Publish drafts after review
    python update_artwork_origins.py --publish-only
"""

import os
import sys
import json
import time
import argparse
import requests
from pathlib import Path
from datetime import datetime

# Script directory for relative paths
SCRIPT_DIR = Path(__file__).parent.resolve()

# Try to load .env file if python-dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv(SCRIPT_DIR / ".env")
except ImportError:
    pass

# Configuration
SANITY_PROJECT_ID = "o12a3h5d"
SANITY_DATASET = "production"
SANITY_API_VERSION = "2024-01-01"
SANITY_TOKEN = os.getenv("SANITY_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Output paths
OUTPUT_DIR = SCRIPT_DIR / "output"
PROGRESS_FILE = OUTPUT_DIR / "origin-update-progress.json"
RESULTS_FILE = OUTPUT_DIR / "origin-research-results.json"

BATCH_SIZE = 10  # Process 10 artworks at a time


def sanity_query(query: str) -> list:
    """Execute a GROQ query against Sanity."""
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/query/{SANITY_DATASET}"
    params = {"query": query}
    headers = {}
    if SANITY_TOKEN:
        headers["Authorization"] = f"Bearer {SANITY_TOKEN}"

    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()
    return response.json().get("result", [])


def sanity_mutate(mutations: list, dry_run: bool = False) -> dict:
    """Execute mutations against Sanity."""
    if dry_run:
        print(f"  [DRY RUN] Would apply {len(mutations)} mutations")
        return {"results": []}

    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/mutate/{SANITY_DATASET}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SANITY_TOKEN}"
    }

    response = requests.post(url, json={"mutations": mutations}, headers=headers)
    response.raise_for_status()
    return response.json()


def sanity_publish(document_ids: list, dry_run: bool = False) -> dict:
    """Publish draft documents."""
    if dry_run:
        print(f"  [DRY RUN] Would publish {len(document_ids)} documents")
        return {"results": []}

    # Create mutations to publish each document
    mutations = []
    for doc_id in document_ids:
        # Remove drafts. prefix if present
        base_id = doc_id.replace("drafts.", "")
        mutations.append({
            "patch": {
                "id": f"drafts.{base_id}",
                "set": {}  # Empty patch to trigger publish
            }
        })

    # Use the publish action endpoint
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/actions/{SANITY_DATASET}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SANITY_TOKEN}"
    }

    actions = [{
        "actionType": "sanity.action.document.publish",
        "draftId": f"drafts.{doc_id.replace('drafts.', '')}",
        "publishedId": doc_id.replace("drafts.", "")
    } for doc_id in document_ids]

    response = requests.post(url, json={"actions": actions}, headers=headers)
    response.raise_for_status()
    return response.json()


def research_artwork_origin(artwork: dict) -> dict:
    """Use OpenAI to research where an artwork was created."""
    name = artwork.get("name", "Unknown")
    artist = artwork.get("artist", "Unknown artist")
    date = artwork.get("date", "Unknown date")
    period = artwork.get("period", "")

    prompt = f"""Research where this artwork was originally created/made.

Artwork: "{name}"
Artist: {artist}
Date: {date}
Period: {period}

Return ONLY a JSON object with these fields:
- location: The city/region and country where the artwork was created (e.g., "Florence, Italy" or "Paris, France")
- latitude: Decimal latitude of that location
- longitude: Decimal longitude of that location
- confidence: "high", "medium", or "low" based on how certain you are
- source: Brief note about why you chose this location (1 sentence)

If you cannot determine the origin, use the artist's primary city of activity.
If still unknown, return location: "Unknown" with null coordinates.

Return ONLY valid JSON, no other text."""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "gpt-4o-mini",  # Fast and cheap
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
        "max_tokens": 200
    }

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        response.raise_for_status()

        content = response.json()["choices"][0]["message"]["content"]
        # Clean up response - sometimes GPT wraps in ```json
        content = content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()

        result = json.loads(content)
        return {
            "location": result.get("location", "Unknown"),
            "latitude": result.get("latitude"),
            "longitude": result.get("longitude"),
            "confidence": result.get("confidence", "low"),
            "source": result.get("source", ""),
            "error": None
        }
    except Exception as e:
        return {
            "location": None,
            "latitude": None,
            "longitude": None,
            "confidence": "none",
            "source": "",
            "error": str(e)
        }


def load_progress() -> dict:
    """Load progress from file."""
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text())
    return {"completed": [], "failed": [], "last_updated": None}


def save_progress(progress: dict):
    """Save progress to file."""
    progress["last_updated"] = datetime.now().isoformat()
    OUTPUT_DIR.mkdir(exist_ok=True)
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2))


def load_results() -> dict:
    """Load research results from file."""
    if RESULTS_FILE.exists():
        return json.loads(RESULTS_FILE.read_text())
    return {}


def save_results(results: dict):
    """Save research results to file."""
    OUTPUT_DIR.mkdir(exist_ok=True)
    RESULTS_FILE.write_text(json.dumps(results, indent=2))


def fetch_artworks_needing_origin() -> list:
    """Get all artworks with location: 'None'."""
    query = '''*[_type == "artwork" && location == "None" && !(_id match "drafts.*")] | order(id asc) {
        _id,
        id,
        name,
        artist,
        date,
        period,
        location,
        originatedCoordinates
    }'''
    return sanity_query(query)


def main():
    parser = argparse.ArgumentParser(description="Update artwork origin locations")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without applying")
    parser.add_argument("--batch", type=int, help="Process only specific batch number")
    parser.add_argument("--publish-only", action="store_true", help="Only publish existing drafts")
    parser.add_argument("--reset", action="store_true", help="Reset progress and start fresh")
    args = parser.parse_args()

    print("=" * 60)
    print("Artwork Origin Location Updater")
    print("=" * 60)

    # Validate environment
    if not OPENAI_API_KEY and not args.publish_only:
        print("Error: OPENAI_API_KEY environment variable not set")
        sys.exit(1)
    if not SANITY_TOKEN:
        print("Error: SANITY_TOKEN environment variable not set")
        sys.exit(1)

    # Load or reset progress
    if args.reset:
        progress = {"completed": [], "failed": [], "last_updated": None}
        save_progress(progress)
        print("Progress reset.")
    else:
        progress = load_progress()

    results = load_results()

    # Fetch artworks
    print("\nFetching artworks with location: 'None'...")
    artworks = fetch_artworks_needing_origin()
    print(f"Found {len(artworks)} artworks needing origin research")

    if args.publish_only:
        # Just publish drafts for completed artworks
        print("\n--- Publishing Drafts ---")
        completed_ids = progress.get("completed", [])
        if not completed_ids:
            print("No completed artworks to publish.")
            return

        print(f"Publishing {len(completed_ids)} drafts...")
        for i in range(0, len(completed_ids), 10):
            batch = completed_ids[i:i+10]
            try:
                sanity_publish(batch, dry_run=args.dry_run)
                print(f"  Published batch {i//10 + 1}")
            except Exception as e:
                print(f"  Error publishing batch: {e}")

        print("\nDone!")
        return

    # Filter out already completed
    completed_set = set(progress.get("completed", []))
    pending = [a for a in artworks if a["_id"] not in completed_set]
    print(f"Already completed: {len(completed_set)}")
    print(f"Pending: {len(pending)}")

    if not pending:
        print("\nAll artworks have been processed!")
        print(f"Run with --publish-only to publish the drafts.")
        return

    # Create batches
    batches = [pending[i:i+BATCH_SIZE] for i in range(0, len(pending), BATCH_SIZE)]
    print(f"Created {len(batches)} batches of {BATCH_SIZE}")

    # Filter to specific batch if requested
    if args.batch is not None:
        if args.batch < 1 or args.batch > len(batches):
            print(f"Error: Batch {args.batch} not found (1-{len(batches)} available)")
            sys.exit(1)
        batches = [batches[args.batch - 1]]
        print(f"Processing only batch {args.batch}")

    # Process each batch
    for batch_idx, batch in enumerate(batches, 1):
        print(f"\n--- Batch {batch_idx}/{len(batches)} ---")

        mutations = []

        for artwork in batch:
            artwork_id = artwork["_id"]
            name = artwork.get("name", "Unknown")[:50]

            print(f"  Researching: {name}...")

            # Research origin
            origin = research_artwork_origin(artwork)

            # Save result
            results[artwork_id] = {
                "name": artwork.get("name"),
                "research": origin,
                "researched_at": datetime.now().isoformat()
            }

            if origin.get("error"):
                print(f"    ERROR: {origin['error']}")
                progress["failed"].append(artwork_id)
                continue

            if origin.get("location") and origin.get("location") != "Unknown":
                print(f"    Found: {origin['location']} ({origin['confidence']})")

                # Create mutation
                patch = {
                    "patch": {
                        "id": artwork_id,
                        "set": {
                            "location": origin["location"]
                        }
                    }
                }

                if origin.get("latitude") and origin.get("longitude"):
                    patch["patch"]["set"]["originatedCoordinates"] = {
                        "_type": "geopoint",
                        "latitude": origin["latitude"],
                        "longitude": origin["longitude"]
                    }

                mutations.append(patch)
                progress["completed"].append(artwork_id)
            else:
                print(f"    Could not determine origin")
                progress["failed"].append(artwork_id)

            # Small delay to avoid rate limits
            time.sleep(0.5)

        # Apply mutations
        if mutations:
            print(f"\n  Applying {len(mutations)} updates to Sanity...")
            try:
                sanity_mutate(mutations, dry_run=args.dry_run)
                print(f"  Success!")
            except Exception as e:
                print(f"  Error: {e}")

        # Save progress after each batch
        save_progress(progress)
        save_results(results)
        print(f"  Progress saved.")

        # Delay between batches
        if batch_idx < len(batches):
            print(f"  Waiting 2s before next batch...")
            time.sleep(2)

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Completed: {len(progress['completed'])}")
    print(f"Failed: {len(progress['failed'])}")
    print(f"Results saved to: {RESULTS_FILE}")
    print(f"Progress saved to: {PROGRESS_FILE}")
    print("\nNext steps:")
    print("1. Review the results in origin-research-results.json")
    print("2. Run with --publish-only to publish drafts")


if __name__ == "__main__":
    main()
