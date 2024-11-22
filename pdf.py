import PyPDF2

# Open the PDF file
with open("ProjectPBL/cv.pdf", "rb") as file:
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()


print(text,'\n')

from groq import Groq

client = Groq(
    api_key="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"
)
completion = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {
            "role": "system",
            "content": "Resume JSON"
        },
        {
            "role": "user",
            "content": "Write a simple resume json for a job position as a front-end developer from the give pdf text:\n"+text+"\nUse the following exact field names:\n\"name\"\n\"contactInfo\" (phone, email, address)\n\"summary\"\n\"skills\"\n\"certifications\""
        }
    ],
    temperature=1,
    max_tokens=1024,
    top_p=1,
    stream=False,
    response_format={"type": "json_object"},
    stop=None,
)

print(completion.choices[0].message)
