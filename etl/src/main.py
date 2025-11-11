import os
import csv
import requests
from extractor.extractor import extract_arxiv_papers

def main():
    csv_file = "processed_files/arxiv_papers.csv"
    
    # Check if CSV file already exists
    if not os.path.exists(csv_file):
        extract_arxiv_papers(csv_file)
    else:
        print(f"CSV file '{csv_file}' already exists. Skipping extraction.")

    # Read CSV file and make POST requests to analyze endpoint
    api_url = "http://127.0.0.1:9000/analyze"
    
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
        title = row.get('title', '')
        url = row.get('url', '')
        
        # Skip if keywords already exist
        if row.get('keywords'):
            print(f"Skipping {title[:50]}... (already has keywords)")
            continue
        
        # Make POST request to analyze endpoint
        try:
            payload = {"url": url}
            response = requests.post(api_url, json=payload, timeout=30)
            response.raise_for_status()

            data = response.json()
            keywords = data.get('response', {}).get('keywords', [])
            
            # Convert keywords list to comma-separated string
            if isinstance(keywords, list):
                keywords_str = ', '.join(keywords)
            else:
                keywords_str = str(keywords) if keywords else ''
            
            # Update the row with keywords
            row['keywords'] = keywords_str
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
            continue

if __name__ == '__main__':
    main()

