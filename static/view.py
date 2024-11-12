import gzip
import shutil
import os
import sys

def decompress_gzip(gzip_file_path, output_file_path):
    # Get the size of the input file
    total_size = os.path.getsize(gzip_file_path)
    bytes_read = 0

    with gzip.open(gzip_file_path, 'rb') as f_in:
        with open(output_file_path, 'wb') as f_out:
            while True:
                # Read a chunk of data
                chunk = f_in.read(1024 * 1024)  # Read in 1 MB chunks
                if not chunk:
                    break  # Exit loop if there's no more data
                f_out.write(chunk)
                
                # Update bytes read and progress
                bytes_read += len(chunk)
                progress = (bytes_read / total_size) * 100
                
                # Print progress bar
                sys.stdout.write('\rProgress: [{:<50}] {:.2f}%'.format('#' * int(progress // 2), progress))
                sys.stdout.flush()

    print()  # Move to the next line after completion

if __name__ == "__main__":
    # Define the input and output file paths
    input_gzip_file = './static/books.gz'
    output_json_file = './static/books.json'
    
    # Check if the input file exists
    if os.path.exists(input_gzip_file):
        # Decompress the GZIP file
        decompress_gzip(input_gzip_file, output_json_file)
        print(f"Decompressed {input_gzip_file} to {output_json_file}.")
    else:
        print(f"The file {input_gzip_file} does not exist.")