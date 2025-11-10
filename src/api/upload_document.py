import requests
import mimetypes
import os

API_URL = "https://workflow.forwen.com/webhook/chat-with-document/documents"

def upload_document(file_path):
    mime_type, _ = mimetypes.guess_type(file_path)

    try:
        with open(file_path, "rb") as f:
            files = {
                "file": (os.path.basename(file_path), f, mime_type)
            }
            response = requests.post(API_URL, files=files)
            response.raise_for_status()
    except requests.RequestException as e:
        return f"Request failed: {e}"

    try:
        data = response.json()
        return data
    except ValueError:
        return "Invalid JSON response"

# Example usage:
if __name__ == "__main__":
    
    doc_id = upload_document(r"C:\Users\JieLum\Downloads\pbe-sample.pdf")
    print(doc_id)


# Example output:
# {'document_id': 22}