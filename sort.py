import requests
import json
import sqlite3

# Function to fetch books from Open Library API
def fetch_books(query, limit=10):
    url = f"https://openlibrary.org/search.json?q={query}&limit={limit}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for errors
        return response.json().get('docs', [])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching books: {e}")
        return []

# Function to sort books by first author's name alphabetically (case-insensitive)
def sort_books_by_author(books):
    return sorted(books, key=lambda x: x['author_name'][0].split()[0].lower() if 'author_name' in x else '')

# Function to sort books by popularity (using number of editions as a proxy)
def sort_books_by_popularity(books):
    return sorted(books, key=lambda x: x.get('edition_count', 0), reverse=True)

# Function to display books
def display_books(books):
    for book in books:
        title = book.get('title', 'No Title')
        authors = ', '.join(book.get('author_name', ['Unknown Author']))
        edition_count = book.get('edition_count', 'N/A')
        print(f"{title} by {authors}, Editions: {edition_count}")

# Function to store book data in SQLite
def store_books_in_db(books):
    conn = sqlite3.connect('books.db')
    cursor = conn.cursor()

    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS books (
            title TEXT,
            author TEXT,
            edition_count INTEGER
        )
    ''')

    # Insert data into table
    for book in books:
        title = book.get('title', 'No Title')
        author = ', '.join(book.get('author_name', ['Unknown Author']))
        edition_count = book.get('edition_count', 0)
        cursor.execute('INSERT INTO books (title, author, edition_count) VALUES (?, ?, ?)', (title, author, edition_count))

    conn.commit()
    conn.close()

# Fetch books from Open Library
books = fetch_books('fiction')

# Sort books by author (alphabetically)
sorted_by_author = sort_books_by_author(books)
print("Books sorted by author:")
display_books(sorted_by_author)

# Sort books by popularity (number of editions)
sorted_by_popularity = sort_books_by_popularity(books)
print("\nBooks sorted by popularity:")
display_books(sorted_by_popularity)

# Optionally, store books in SQLite database
store_books_in_db(sorted_by_popularity)