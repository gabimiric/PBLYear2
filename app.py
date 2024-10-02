from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
from groq import Groq
import webbrowser
import os

app = Flask(__name__, template_folder='.')

CORS(app)
@app.route('/')
def home():
  return render_template('home.html')

@app.route('/book-reference')
def book():
    return render_template('book-reference.html')

@app.route('/email-assist')
def email():
    return render_template('email-assist.html')

    
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

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt_message}],
        model="llama3-8b-8192",
    )


    suggestions_content = chat_completion.choices[0].message.content.splitlines()

    suggestions = [s.strip() for s in suggestions_content if s.strip() and '[' in s and ']' in s]
    extracted_suggestions = [s[s.index('[')+1:s.index(']')] for s in suggestions]
    formatted_suggestions = "\n".join(extracted_suggestions)

    return jsonify({'suggestions': formatted_suggestions})  




if __name__ == '__main__':
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        webbrowser.open('http://127.0.0.1:5000/')
    app.run(debug=True)
