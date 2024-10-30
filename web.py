import requests
from bs4 import BeautifulSoup
from dateutil import parser, tz
import calendar
import json

def format_publish_date(date_str):
    tzinfos = {
        'PT': tz.gettz('America/Los_Angeles'),
        'ET': tz.gettz('America/New_York'),
        'CT': tz.gettz('America/Chicago'),
        'MT': tz.gettz('America/Denver'),
        'GMT': tz.tzutc(),
        'UTC': tz.tzutc(),
        'CST': tz.gettz('America/Chicago'),
        'PST': tz.gettz('America/Los_Angeles'),
        'EST': tz.gettz('America/New_York'),
    }

    try:
        date_obj = parser.parse(date_str, tzinfos=tzinfos)
        month_name = calendar.month_name[date_obj.month]
        return f"{date_obj.year}, {month_name} {date_obj.day}"
    except (ValueError, TypeError):
        return ""

def find_authors_in_json(data, keys):
    authors = set()
    
    if isinstance(data, dict):
        for key in keys:
            if key in data:
                if isinstance(data[key], list):
                    for item in data[key]:
                        if isinstance(item, dict) and "name" in item:
                            authors.add(item["name"].strip())
                        elif isinstance(item, str):
                            authors.add(item.strip())
                elif isinstance(data[key], dict) and "name" in data[key]:
                    authors.add(data[key]["name"].strip())
        
        for value in data.values():
            authors.update(find_authors_in_json(value, keys))
    
    elif isinstance(data, list):
        for item in data:
            authors.update(find_authors_in_json(item, keys))

    return authors

def extract_authors_from_json(json_data):
    keys_to_search = ["author", "creator", "writer", "contributor"]
    return find_authors_in_json(json_data, keys_to_search)

def clean_authors(author_list):
    ignore_words = {"by", "and", "&", "with", "the", "of", "for", "in", "on", "at", "to", "as", "an", "is", "was", "that"}
    cleaned_authors = []

    for author in author_list:
        split_authors = [name.strip() for name in author.replace('&', ',').replace('and', ',').split(',')]
        
        for name in split_authors:
            words = [word.strip() for word in name.split() if word.strip().lower() not in ignore_words]
            cleaned_author = " ".join(words)
            if cleaned_author:
                cleaned_authors.append(cleaned_author)

    return cleaned_authors

def extract_article_info(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')

    title = ""
    title_meta = soup.find("meta", property="og:title") or soup.find("meta", property="twitter:title")
    if title_meta and title_meta.get("content"):
        title = title_meta["content"].strip()

    if not title:
        title_tag = soup.find("title")
        if title_tag and title_tag.text.strip():
            title = title_tag.text.strip()

    if not title:
        h1_tag = soup.find("h1")
        if h1_tag and h1_tag.text.strip():
            title = h1_tag.text.strip()

    authors = set()

    author_meta = soup.find_all(['meta'], {'name': 'author'}) + soup.find_all("meta", property="article:author")
    for meta in author_meta:
        if meta.get('content'):
            authors.add(meta['content'].strip())

    author_tags = soup.find_all("a", class_="person-hover")
    for tag in author_tags:
        if tag.text.strip():
            authors.add(tag.text.strip())

    byline_tag = soup.find("div", class_="byline-contributor")
    if byline_tag and byline_tag.text.strip():
        authors.add(byline_tag.text.strip())

    json_ld_scripts = soup.find_all("script", type="application/ld+json")
    for script in json_ld_scripts:
        try:
            json_data = json.loads(script.string)
            authors.update(extract_authors_from_json(json_data))
        except json.JSONDecodeError:
            continue

    authors = clean_authors(authors)
    authors = list(authors) if authors else []

    publish_date = ""

    date_meta = (
        soup.find("meta", property="article:published_time") or
        soup.find("meta", property="og:published_time") or
        soup.find("meta", {"name": "date"}) or
        soup.find("meta", property="datePublished")
    )
    if date_meta and date_meta.get("content"):
        publish_date = date_meta["content"].strip()

    if not publish_date:
        date_tag = soup.find("p", class_="text-medium")
        if date_tag and date_tag.text.strip():
            publish_date = date_tag.text.strip()

    if not publish_date:
        date_tag = soup.find("time")
        if date_tag and date_tag.get("datetime"):
            publish_date = date_tag["datetime"].strip()
        elif date_tag and date_tag.text.strip():
            publish_date = date_tag.text.strip()

    if not publish_date:
        json_ld_scripts = soup.find_all("script", type="application/ld+json")
        for script in json_ld_scripts:
            try:
                json_data = json.loads(script.string)
                if isinstance(json_data, list):
                    for item in json_data:
                        if 'datePublished' in item:
                            publish_date = item['datePublished']
                elif isinstance(json_data, dict):
                    if 'datePublished' in json_data:
                        publish_date = json_data['datePublished']
            except json.JSONDecodeError:
                continue

    publish_date = format_publish_date(publish_date) if publish_date else ""

    favicon = ""
    favicon_link = soup.find("link", rel=lambda rel: rel and 'icon' in rel.lower())
    if favicon_link and favicon_link.get("href"):
        favicon = favicon_link["href"].strip()

    if favicon and not favicon.startswith(('http://', 'https://')):
        from urllib.parse import urljoin
        favicon = urljoin(url, favicon)

    return title, authors, publish_date, favicon

