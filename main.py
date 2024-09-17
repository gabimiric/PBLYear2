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
