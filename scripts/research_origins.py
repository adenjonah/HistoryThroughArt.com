#!/usr/bin/env python3
"""
Research artwork origins using OpenAI.
Reads from local JSON, outputs updates file for manual push.

Usage:
    source venv/bin/activate
    python research_origins.py
"""

import json
import time
import requests
from pathlib import Path
from datetime import datetime

# Load env
try:
    from dotenv import load_dotenv
    import os
    load_dotenv(Path(__file__).parent / ".env")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
except:
    OPENAI_API_KEY = None

SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR / "output/artworks-needing-origin.json"
OUTPUT_FILE = SCRIPT_DIR / "output/origin-updates.json"
PROGRESS_FILE = SCRIPT_DIR / "output/research-progress.json"


def research_origin(name: str) -> dict:
    """Use OpenAI to research where an artwork was created."""
    prompt = f"""Research where this artwork was originally created/made.

Artwork: "{name}"

Return ONLY a JSON object with these fields:
- location: The city/region and country where the artwork was created (e.g., "Florence, Italy")
- latitude: Decimal latitude of that location
- longitude: Decimal longitude of that location
- confidence: "high", "medium", or "low"

If unknown, return location: "Unknown" with null coordinates.
Return ONLY valid JSON, no markdown or other text."""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
        "max_tokens": 150
    }

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        response.raise_for_status()

        content = response.json()["choices"][0]["message"]["content"].strip()
        # Clean markdown wrappers
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()

        return json.loads(content)
    except Exception as e:
        return {"location": None, "error": str(e)}


def load_progress() -> set:
    """Load already-processed IDs."""
    if PROGRESS_FILE.exists():
        data = json.loads(PROGRESS_FILE.read_text())
        return set(data.get("completed", []))
    return set()


def save_progress(completed: set):
    """Save progress."""
    PROGRESS_FILE.write_text(json.dumps({
        "completed": list(completed),
        "last_updated": datetime.now().isoformat()
    }, indent=2))


def main():
    if not OPENAI_API_KEY:
        print("Error: Set OPENAI_API_KEY in .env file")
        return

    print("=" * 50)
    print("Artwork Origin Research")
    print("=" * 50)

    # Load artworks
    artworks = json.loads(INPUT_FILE.read_text())
    print(f"Loaded {len(artworks)} artworks")

    # Load existing results
    if OUTPUT_FILE.exists():
        results = json.loads(OUTPUT_FILE.read_text())
    else:
        results = []

    # Load progress
    completed = load_progress()
    print(f"Already completed: {len(completed)}")

    # Filter pending
    pending = [a for a in artworks if a["_id"] not in completed]
    print(f"Pending: {len(pending)}")

    if not pending:
        print("\nAll done! Results in output/origin-updates.json")
        return

    # Process
    for i, artwork in enumerate(pending):
        _id = artwork["_id"]
        name = artwork["name"]

        print(f"\n[{i+1}/{len(pending)}] {name[:50]}...")

        result = research_origin(name)

        if result.get("error"):
            print(f"  ERROR: {result['error']}")
            continue

        if result.get("location") and result["location"] != "Unknown":
            print(f"  -> {result['location']} ({result.get('confidence', 'unknown')})")

            results.append({
                "_id": _id,
                "name": name,
                "location": result["location"],
                "latitude": result.get("latitude"),
                "longitude": result.get("longitude"),
                "confidence": result.get("confidence", "medium")
            })

            # Save after each success
            OUTPUT_FILE.write_text(json.dumps(results, indent=2))
        else:
            print(f"  -> Unknown origin")

        completed.add(_id)
        save_progress(completed)

        # Rate limit
        time.sleep(0.3)

    print("\n" + "=" * 50)
    print(f"Complete! {len(results)} origins found")
    print(f"Results: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
