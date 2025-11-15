import json
import os
import csv
import requests
from extractor.extractor import extract_arxiv_papers

def analyze_and_update_row(row, api_url, csv_file, fieldnames, rows):
    """Make POST request to analyze endpoint and update the row with keywords."""
    title = row.get('title', '')
    url = row.get('url', '')
    
    # Skip if keywords already exist
    if row.get('keywords'):
        print(f"Skipping {title[:50]}... (already has keywords)")
        return
    
    # Make POST request to analyze endpoint
    try:
        payload = {"url": url}
        response = requests.post(api_url, json=payload, timeout=30)
        response.raise_for_status()

        data = response.json()
        keywords = data.get('response', {}).get('keywords', [])
        
        # Update the row with keywords
        row['keywords'] = json.dumps(keywords)
        print(f"Added keywords for: {title[:50]}...")
        
        # Write updated CSV file after each successful API call
        with open(csv_file, 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        
    except requests.RequestException as e:
        print(f"Error analyzing {title[:50]}...: {e}")
        row['keywords'] = ''
        # Update CSV even on error
        with open(csv_file, 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

def create_blog(row, api_url, category):
    """Make POST request to create blog endpoint."""
    title = row.get('title', '')
    url = row.get('url', '')
    keywords_str = row.get('keywords', '')
    
    # Skip if keywords don't exist
    if not keywords_str:
        print(f"Skipping {title[:50]}... (no keywords available)")
        return False
    
    try:
        # Parse keywords from JSON string
        keywords = json.loads(keywords_str)
        
        # Ensure keywords is a list
        if not isinstance(keywords, list):
            print(f"Error: keywords is not a list for {title[:50]}...")
            return False
        
        # Prepare payload for blog creation
        payload = {
            "title": title,
            "url": url,
            "category": category,
            "keywords": keywords
        }
        
        response = requests.post(api_url, json=payload, timeout=30)
        response.raise_for_status()
        
        print(f"Successfully created blog: {title[:50]}...")
        return True
        
    except json.JSONDecodeError as e:
        print(f"Error parsing keywords JSON for {title[:50]}...: {e}")
        return False
    except requests.RequestException as e:
        print(f"Error creating blog {title[:50]}...: {e}")
        return False

def main():
    csv_file = ".processed_files/arxiv_papers.csv"
    
    # Check if CSV file already exists
    if not os.path.exists(csv_file):
        extract_arxiv_papers(csv_file)
    else:
        print(f"CSV file '{csv_file}' already exists. Skipping extraction.")

    # Read CSV file and make POST requests to analyze endpoint
    api_url = "http://127.0.0.1:9000"
    
    # Read all rows into memory
    rows = []
    fieldnames = ['title', 'url']
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        fieldnames = reader.fieldnames or ['title', 'url']
        rows = list(reader)
    
    # Add keywords column if it doesn't exist
    if 'keywords' not in fieldnames:
        fieldnames.append('keywords')
    
    # Process each row and update CSV after each API call
    for row in rows:
        analyze_and_update_row(row, f"{api_url}/analyze", csv_file, fieldnames, rows)
        create_blog(row, f"{api_url}/v1/blogs", "SOFTWARE_ENGINEERING")

if __name__ == '__main__':
    main()

