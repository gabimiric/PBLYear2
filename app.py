from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
from groq import Groq
import sort

app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
  return render_template('index.html')






client = Groq(api_key="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")
@app.route('/generate-email-template', methods=['POST'])
def generate_email_template():
    data = request.get_json()
    subject = data.get('subject', 'Requesting Documents')

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": f"Write a simple email about {subject}, insert just the text of the email."}],
        model="llama3-8b-8192",
    )

    email_content = chat_completion.choices[0].message.content
    return jsonify({'email': email_content})

@app.route('/get-synonyms', methods=['GET'])
def get_synonyms():
    word = request.args.get('word')
    api_url = f'https://api.api-ninjas.com/v1/thesaurus?word={word}'
    response = requests.get(api_url, headers={'X-Api-Key': 'NGhmuQSa9T88imDosm5ruQ==srVXTXfoZwm6XfT5'})

    if response.status_code == 200:
        data = response.json()
        synonyms = data.get('synonyms', [])
        return jsonify({'synonyms': synonyms[:3]})
    else:
        return jsonify({'error': 'Could not fetch synonyms'}), 500
    


@app.route('/fetch-books', methods=['GET'])
def fetch_books():
    query = request.args.get('query')
    sort_by = request.args.get('sort_by', 'author')

    # Fetch books using the sort.py script
    books = sort.fetch_books(query)
    
    if sort_by == 'popularity':
        sorted_books = sort.sort_books_by_popularity(books)
    else:
        sorted_books = sort.sort_books_by_author(books)
    
    # Format books for display
    formatted_books = [
        {
            'title': book.get('title', 'No Title'),
            'author': ', '.join(book.get('author_name', ['Unknown'])),
            'edition_count': book.get('edition_count', 'N/A')
        }
        for book in sorted_books
    ]

    return jsonify({'books': formatted_books})




if __name__ == '__main__':
    app.run(debug=True)