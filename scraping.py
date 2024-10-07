import json
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
from urllib.parse import urljoin

# Set up Chrome options (optional, can be used to run headless or configure other options)
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run headless, i.e., without opening a browser window
chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration (optional)
chrome_options.add_argument("--no-sandbox")  # Bypass OS security model (for Linux environments)

# Initialize the Selenium WebDriver with options
driver = webdriver.Chrome(options=chrome_options)

# Base URL and parameters for pagination
base_url = 'https://carturesti.ro/raft/carte-straina-1937'
per_page = 90
start_page = 1
end_page = 100  # Last page number to scrape

# Counter for JSON files created
json_file_count = 0

# Loop through each page
for page in range(start_page, end_page + 1):
    # Construct the full URL for the current page
    page_url = f'{base_url}?page={page}&per-page={per_page}'
    print(f'Visiting: {page_url}')
    driver.get(page_url)
    time.sleep(3)  # Wait for the page to load

    # Parse the page using BeautifulSoup
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')

    # Find all the anchor tags that link to individual book pages
    elements = soup.find_all('a', class_='clean-a select-item-event')

    # Extract the href attributes for all the links
    hrefs = [element.get('href') for element in elements]

    # List to store all book data for the current JSON file
    all_book_data = []

    # Loop through each book link
    for link in hrefs:
        new_link = urljoin(page_url, link)
        print(f'Visiting: {new_link}')

        # Visit the book's page
        driver.get(new_link)
        time.sleep(2)  # Wait for the book page to load

        # Parse the book's page using BeautifulSoup
        book_page_source = driver.page_source
        book_soup = BeautifulSoup(book_page_source, 'html.parser')

        # Try to find the book title, author name, rating, and publication date
        try:
            # Book title and author
            title = book_soup.find('h1', class_='titluProdus').text.strip()
            print(f"Title: {title}")  # Print for testing
            author = book_soup.find('div', class_='autorProdus').a.text.strip()
            print(f"Author: {author}")  # Print for testing

            # Get all productAttr divs
            product_attr_divs = book_soup.find_all('div', class_='productAttr')

            # Initialize publication date and filter for the one you want
            publication_date = 'N/A'
            for div in product_attr_divs:
                label = div.find('span', class_='productAttrLabel')
                if label and label.text.strip() == 'Data publicarii:':
                    publication_date = div.find('div').text.strip()
                    break  # Stop searching once found

            print(f"Publication Date: {publication_date}")  # Print for testing

            # Rating
            rating_span = book_soup.find('span', {'data-ng-bind': 'h.numberFormat(agregateRating,1)'})
            rating = rating_span.text.strip() if rating_span else 'N/A'
            print(f"Rating: {rating}")  # Print for testing

            # Store the book details in a dictionary
            book_data = {
                'title': title,
                'author': author,
                'publication_date': publication_date,
                'rating': rating
            }

            # Add the book data to the list
            all_book_data.append(book_data)
            print(f'Successfully extracted: {title} by {author}, Date: {publication_date}, Rating: {rating}')
        except AttributeError as e:
            print(f"Error on page {new_link}: {e}")

    # Save the book data to a JSON file
    if all_book_data:
        json_file_count += 1
        json_filename = f'data_{json_file_count}.json'
        with open(json_filename, 'w') as json_file:
            json.dump(all_book_data, json_file, indent=4)
        print(f'Saved data to {json_filename}')

    # Stop if we've created 100 JSON files
    if json_file_count >= 100:
        print("Reached 100 JSON files. Exiting.")
        break

# Close the Selenium browser
driver.quit()
