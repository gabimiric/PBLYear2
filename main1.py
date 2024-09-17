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