import re
import sqlite3
import contextlib
from flask import Flask, request, jsonify, render_template, session, redirect
from flask_cors import CORS
import requests
from groq import Groq
import webbrowser
import os
from web import extract_article_info
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from datetime import timedelta
from database import setup_database
from utils import login_required, set_session

app = Flask(__name__, template_folder='.')

app.config['SECRET_KEY'] = 'EXAMPLE_xpSm7p5bgJY8rNoBjGWiz5yjxMNlW6231IBI62OkLc='
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=15)

setup_database(name='users.db')



CORS(app)
@app.route('/')

def home():
  return render_template('templates/home.html')

#this is for the account shit 
@app.route('/account')
def account():
    return render_template('templates/account.html')












@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('templates/account.html')

    # Set data to variables
    username = request.form.get('username')
    password = request.form.get('password')
    
    # Attempt to query associated user data
    query = 'select username, password, email from users where username = :username;'

    with contextlib.closing(sqlite3.connect('users.db')) as conn:
        with conn:
            account = conn.execute(query, {'username': username}).fetchone()

    if not account: 
        return render_template('templates/account.html', error='Username does not exist')

    # Verify password
    try:
        ph = PasswordHasher()
        ph.verify(account[1], password)
    except VerifyMismatchError:
        return render_template('templates/account.html', error='Incorrect password')

    # Check if password hash needs to be updated
    if ph.check_needs_rehash(account[1]):
        query = 'update set password = :password where username = :username;'
        params = {'password': ph.hash(password), 'username': account[0]}

        with contextlib.closing(sqlite3.connect('users.db')) as conn:
            with conn:
                conn.execute(query, params)

    # Set cookie for user session
    set_session(
        username=account[0], 
        remember_me='remember-me' in request.form
    )
    
    return redirect('/')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('templates/register.html')
    
    # Store data to variables 
    password = request.form.get('password')
    confirm_password = request.form.get('confirm-password')
    username = request.form.get('username')
    email = request.form.get('email')

    # Verify data
    if len(password) < 8:
        return render_template('templates/register.html', error='Your password must be 8 or more characters')
    if password != confirm_password:
        return render_template('templates/register.html', error='Passwords do not match')
    if not re.match(r'^[a-zA-Z0-9]+$', username):
        return render_template('templates/register.html', error='Username must only be letters and numbers')
    if not 3 < len(username) < 26:
        return render_template('templates/register.html', error='Username must be between 4 and 25 characters')

    query = 'select username from users where username = :username;'
    with contextlib.closing(sqlite3.connect('users.db')) as conn:
        with conn:
            result = conn.execute(query, {'username': username}).fetchone()
    if result:
        return render_template('templates/register.html', error='Username already exists')

    # Create password hash
    pw = PasswordHasher()
    hashed_password = pw.hash(password)

    query = 'insert into users(username, password, email) values (:username, :password, :email);'
    params = {
        'username': username,
        'password': hashed_password,
        'email': email
    }

    with contextlib.closing(sqlite3.connect('users.db')) as conn:
        with conn:
            result = conn.execute(query, params)

    # We can log the user in right away since no email verification
    set_session(username=username)
    return redirect('/')

    
@app.route('/book-reference')
def book():
    return render_template('templates/book-reference.html')

@app.route('/email-assist')
def email():
    return render_template('templates/email-assist.html')

    
client = Groq(api_key="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")

@app.route('/generate-email-template', methods=['POST'])
def generate_email_template():
    data = request.get_json()
    subject = data.get('subject')
    recipient_name = data.get('recipient_name')
    sender_name = data.get('sender_name')
    email_details = data.get('email_details')
    
    if not subject or not recipient_name or not sender_name:
        return jsonify({'email': ''})  

    prompt_message = (
        f"Write a simple email about {subject}. "
        f"Address the email to {recipient_name}, and sign off as {sender_name}. "
        f"Make sure to include these details: {email_details} "
        "Do not use any placeholders or variables—make it a finished product. Also, dont comment just write the email."
    )

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt_message}],
        model="llama3-8b-8192",
    )

    email_content = chat_completion.choices[0].message.content
    return jsonify({'email': email_content})

@app.route('/generate-suggestions', methods=['POST'])
def generate_suggestions():
    data = request.get_json()
    subject = data.get('subject')

    if not subject or subject.strip() == "":
        return jsonify({'suggestions': ''}) 

    prompt_message = (
        f"Generate 10 specific and relevant placeholders for pieces of information related to the subject '{subject}' "
        f"that the sender should complete in the email. Each suggestion should be actionable and concise, "
        "using only 1-2 words. Please enclose each suggestion in square brackets [like this]. "
        "Do not include any introductory comments, vague advice, or lists; just provide the suggestions directly."
    )

    def get_suggestions():
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt_message}],
            model="llama3-8b-8192",
        )

        suggestions_content = chat_completion.choices[0].message.content.splitlines()
        suggestions = [s.strip() for s in suggestions_content if s.strip() and '[' in s and ']' in s]
        extracted_suggestions = [s[s.index('[')+1:s.index(']')] for s in suggestions]
        return extracted_suggestions

    suggestions = get_suggestions()

    if len(suggestions) < 5:
        suggestions = get_suggestions()
        
    formatted_suggestions = "\n".join(suggestions)

    return jsonify({'suggestions': formatted_suggestions})

@app.route('/extract-web-info', methods=['POST'])
def extract_web_info():
    data = request.get_json()
    link = data.get('link')
    title, author_names, publish_date, favicon = extract_article_info(link)
    
    return jsonify({
        'title': title,
        'author_names': author_names,
        'publish_date': publish_date,
        'favicon': favicon
    })









if __name__ == '__main__':
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        webbrowser.open('http://127.0.0.1:5000/')
    app.run(debug=True)