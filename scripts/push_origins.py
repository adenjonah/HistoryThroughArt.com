#!/usr/bin/env python3
"""
Push researched artwork origins to Sanity.
Reads from origin-updates.json, pushes to Sanity API.

Usage:
    source venv/bin/activate
    python push_origins.py
    python push_origins.py --dry-run
    python push_origins.py --publish  # publish drafts after
"""

import json
import os
import sys
import argparse
import requests
from pathlib import Path

# Load env
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR / "output/origin-updates.json"
PROGRESS_FILE = SCRIPT_DIR / "output/push-progress.json"

# Sanity config
PROJECT_ID = "o12a3h5d"
DATASET = "production"
API_VERSION = "2024-01-01"
TOKEN = os.getenv("SANITY_TOKEN")


def load_progress():
    if PROGRESS_FILE.exists():
        return set(json.loads(PROGRESS_FILE.read_text()))
    return set()


def save_progress(done: set):
    PROGRESS_FILE.write_text(json.dumps(list(done), indent=2))


def patch_artwork(artwork: dict, dry_run: bool = False) -> bool:
    """Patch a single artwork with origin data."""
    _id = artwork["_id"]
    location = artwork["location"]
    lat = artwork.get("latitude")
    lng = artwork.get("longitude")

    patch_set = {"location": location}
    if lat is not None and lng is not None:
        patch_set["originatedCoordinates"] = {
            "latitude": lat,
            "longitude": lng
        }

    if dry_run:
        print(f"  [DRY] {_id}: {location}")
        return True

    url = f"https://{PROJECT_ID}.api.sanity.io/v{API_VERSION}/data/mutate/{DATASET}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {TOKEN}"
    }

    mutation = {
        "mutations": [{
            "patch": {
                "id": _id,
                "set": patch_set
            }
        }]
    }

    try:
        resp = requests.post(url, json=mutation, headers=headers, timeout=30)
        resp.raise_for_status()
        return True
    except Exception as e:
        print(f"  ERROR {_id}: {e}")
        return False


def publish_all(ids: list, dry_run: bool = False):
    """Publish all drafts."""
    if dry_run:
        print(f"[DRY] Would publish {len(ids)} drafts")
        return

    url = f"https://{PROJECT_ID}.api.sanity.io/v{API_VERSION}/data/actions/{DATASET}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {TOKEN}"
    }

    # Batch publish in groups of 20
    for i in range(0, len(ids), 20):
        batch = ids[i:i+20]
        actions = [{
            "actionType": "sanity.action.document.publish",
            "draftId": f"drafts.{_id.replace('drafts.', '')}",
            "publishedId": _id.replace("drafts.", "")
        } for _id in batch]

        try:
            resp = requests.post(url, json={"actions": actions}, headers=headers, timeout=60)
            resp.raise_for_status()
            print(f"  Published batch {i//20 + 1}")
        except Exception as e:
            print(f"  ERROR publishing batch: {e}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Preview only")
    parser.add_argument("--publish", action="store_true", help="Publish drafts")
    parser.add_argument("--reset", action="store_true", help="Reset progress")
    args = parser.parse_args()

    if not TOKEN:
        print("Error: SANITY_TOKEN not set in .env")
        sys.exit(1)

    print("=" * 50)
    print("Push Artwork Origins to Sanity")
    print("=" * 50)

    # Load data
    artworks = json.loads(INPUT_FILE.read_text())
    print(f"Loaded {len(artworks)} artworks from origin-updates.json")

    # Load progress
    if args.reset:
        done = set()
        save_progress(done)
        print("Progress reset.")
    else:
        done = load_progress()

    print(f"Already pushed: {len(done)}")

    # Filter pending
    pending = [a for a in artworks if a["_id"] not in done]
    print(f"Pending: {len(pending)}")

    if args.publish:
        print("\n--- Publishing Drafts ---")
        all_ids = [a["_id"] for a in artworks]
        publish_all(all_ids, args.dry_run)
        print("Done!")
        return

    if not pending:
        print("\nAll done! Run with --publish to publish drafts.")
        return

    # Push updates
    print(f"\n--- Pushing {len(pending)} Updates ---")
    success = 0
    for i, artwork in enumerate(pending):
        if patch_artwork(artwork, args.dry_run):
            done.add(artwork["_id"])
            success += 1
            if not args.dry_run and (i + 1) % 10 == 0:
                save_progress(done)
                print(f"  Progress: {i+1}/{len(pending)}")

    save_progress(done)
    print(f"\n{'[DRY RUN] ' if args.dry_run else ''}Pushed {success}/{len(pending)} artworks")
    print("Run with --publish to publish drafts.")


if __name__ == "__main__":
    main()
