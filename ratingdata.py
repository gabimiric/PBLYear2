import json
import os

# Define the path for the original JSON files and the output directory
input_file_1 = 'json/data_1.json'  # Path to the first JSON file
input_file_2 = 'json/data_2.json'  # Path to the second JSON file
output_dir = 'json'  # Directory to save the output files

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Function to split data into with and without ratings
def split_books(input_file):
    with open(input_file, 'r') as f:
        books = json.load(f)

    # Split data into two lists
    books_with_ratings = [book for book in books if float(book['rating']) > 0.0]
    books_without_ratings = [book for book in books if float(book['rating']) == 0.0]

    return books_with_ratings, books_without_ratings

# Process both input files
for input_file in [input_file_1, input_file_2]:
    books_with_ratings, books_without_ratings = split_books(input_file)

    # Write books with ratings to a new JSON file
    with open(f'{output_dir}/books_with_ratings_{os.path.basename(input_file)}', 'w') as f:
        json.dump(books_with_ratings, f, indent=4)

    # Write books without ratings to another JSON file
    with open(f'{output_dir}/books_without_ratings_{os.path.basename(input_file)}', 'w') as f:
        json.dump(books_without_ratings, f, indent=4)

print("Files have been created successfully!")
