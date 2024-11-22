# LazyQuill Changelog


## 22/11/2024 - 22/11/2024 - Web-Scraper Improvement
Improved program structure and optimized the web-scraper for better performance and accuracy.

## 8/11/2024 - 22/11/2024 - Database Optimization
Optimized the database by creating different tables in order to make it more effcient when searching queries:
- Editions - contains book_key, book_title, author(key), publisher, publish_date, works_key
- Authors - contains author key and author name
- books_sorted, contains book_key, works_key, title (ordered by title to use for optimization later)
- Works - work_id, author_id, cover
(book_key is practically each edition of a book of works_key)
These tables will make searching through the data much easier as it will avoid redudancy. We will look into ways to further improve query efficiency.

## 26/10/2024-8/11/2024 - New Feature Implementation and Book Database
We created the database which stores the book information in a table inside a database. The web-scraping part and email generator were added, although just their rough functionalities.

## 20/10/2024-24/10/2024 - APIs Back Online
OpenLibrary was back online so we could use the APIs again. However, we still decided to keep working on creating our own database, in order to avoid a situation like this in the future. We also discussed adding a reference generator for sites, utilizing web-scraping, and adding a generator for resumes from a CV saved as a PDF.

## 07/10/2024-18/10/2024 - API Problems
The APIs provided by OpenLibrary were unavailable due to the site being attacked and taken down. Thus the book search part of the project didn't work. We discussed how to fix it and came to an agreement on using the data dumps that were downloaded prior in order to create our own database to use instead of relying on the APIs.

## 30/09/2024-04/10/2024 - Small Tweaks
Various fixes and small changes to the front-end. 

## 23/09/2024-27/09/2024 - LazyQuill's Main Functionality Finished
LazyQuill is up and functional. The front-end was designed and linked with the backend of the project through [Flask](https://flask.palletsprojects.com/en/stable/) microframework.

## 16/09/2024-20/09/2024 - LazyQuill Early Development
During this time period we researched the necessary tools that we would require for our project and also discussed additional changes that we wish to make. We tested a lot of generative APIs, with the only one that worked being Llamma through the [GroqCloud Platform](https://groq.com/groqcloud/). On top of this we theorized of adding a feature that would allow synonyms to be found for certain words within the generated text and went with [Thesaurus API from API Ninjas](https://api-ninjas.com/api/thesaurus). We also continued working on the book reference part of the project, specifically adding a way to search by publisher, author, year of publishing and to also show the book cover when it finds it, all through the use of [OpenLibrary's  APIs](https://openlibrary.org/developers/api). All the back-end functions were created for these.
```python
import requests

word = input("Enter your word:")
api_url = 'https://api.api-ninjas.com/v1/thesaurus?word={}'.format(word)
response = requests.get(api_url, headers={'X-Api-Key': 'NGhmuQSa9T88imDosm5ruQ==srVXTXfoZwm6XfT5'})

if response.status_code == requests.codes.ok:
    data = response.json()  # Parse JSON response
    synonyms = data.get('synonyms', [])  # Get synonyms, if available
    antonyms = data.get('antonyms', [])
    if synonyms:
        first_few_synonyms = synonyms[:5]  # Store the first 3 synonyms in a list
        print("First few synonyms:", first_few_synonyms)
    if antonyms:
        first_few_antonyms = antonyms[:5]
        print("First few antonyms:", first_few_antonyms)
    else:
        print("No synonyms found.")
else:
    print("Error:", response.status_code, response.text)
```
```python
import os

from groq import Groq

client = Groq(
    api_key="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",
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Write a simple email template about requesting documents of confirmation of enrollment",
        }
    ],
    model="llama3-8b-8192",
)

print(chat_completion.choices[0].message.content)
```

## 05/09/2024-14/09/2024 - LazyQuill Pre-Development
We spent 5 days to figure out what exactly our project's purpose is and what to implement when creating. We settled on creating a tool that would allow users to generate emails by inputting certain details. We also decided to add a feature that would allow users to search much more easily for books and put them in a reference format. 






