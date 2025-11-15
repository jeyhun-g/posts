import requests
from bs4 import BeautifulSoup
import csv
import sys


def fetch_arxiv_page(url):
    """Fetch HTML content from the arXiv URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching URL: {e}", file=sys.stderr)
        sys.exit(1)


def extract_papers(html_content):
    """Extract paper titles and URLs from arXiv HTML content."""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Locate main > dl.articles container
    main = soup.find('main')
    if not main:
        print("Error: Could not find <main> element", file=sys.stderr)
        return []
    
    articles_dls = main.find_all('dl', id='articles')
    if not articles_dls:
        print("Error: Could not find dl.articles within main", file=sys.stderr)
        return []
    
    papers = []
    
    # Loop over each dl.articles container
    for articles_container in articles_dls:
        # Find all dt elements within the articles container
        dt_elements = articles_container.find_all('dt')
        
        for dt in dt_elements:
            # Find the corresponding dd element (next sibling)
            dd = dt.find_next_sibling('dd')
            if not dd:
                continue
            
            # Extract URL from dt > a.title where text is "View HTML"
            url = None
            # Find <a> tag with class 'title' that contains "View HTML" text
            title_link = dt.find('a', string='html')
            if not title_link:
                continue
            
            url = title_link.get('href')
            
            # Extract title from dd > div.meta > div.list-title
            title = None
            title_div = dd.find('div', class_='list-title')
            if title_div:
                title = title_div.get_text(strip=True).replace("Title:", "")
            
            # Only add if we have both title and url
            if title and url:
                papers.append({'title': title, 'url': url})
    
    return papers


def write_to_csv(papers, output_file):
    """Write extracted papers to CSV file."""
    if not papers:
        print("No papers to write", file=sys.stderr)
        return
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['title', 'url']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for paper in papers:
            writer.writerow(paper)
    
    print(f"Successfully extracted {len(papers)} papers to {output_file}")


def extract_arxiv_papers(csv_file: str):

    if not csv_file:
        print("Error: CSV file is required", file=sys.stderr)
        return
    
    """Main function to orchestrate the extraction process."""
    url = 'https://arxiv.org/list/cs.SE/recent'
    
    print(f"Fetching data from {url}...")
    html_content = fetch_arxiv_page(url)
    
    print("Extracting papers...")
    papers = extract_papers(html_content)
    
    print(f"Writing {len(papers)} papers to CSV...")
    write_to_csv(papers, csv_file)


