import PyPDF2
import json
from groq import Groq

# Open the PDF file and extract text
with open("cv.pdf", "rb") as file:
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()


print(text,'\n')

# Initialize Groq client
client = Groq(
    api_key="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"
)

# Create a JSON response from the extracted text
completion = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {
            "role": "system",
            "content": "Resume JSON"
        },
        {
            "role": "user",
            "content": "Write a simple resume json for a job position as a front-end developer from the given PDF text:\n" + text + "\nUse the following exact field names:\n\"name\"\n\"contactInfo\" (phone, email, address)\n\"summary\"\n\"skills\"\n\"certifications\""
        }
    ],
    temperature=1,
    max_tokens=1024,
    top_p=1,
    stream=False,
    response_format={"type": "json_object"},
    stop=None,
)

# Extract the content from the completion response
resume_json = completion.choices[0].message.content

# Save to a file in the same directory with UTF-8 encoding
output_file = "resume.json"
with open(output_file, "w", encoding="utf-8") as json_file:
    json_file.write(resume_json)

print(f"Resume JSON saved to {output_file}")
