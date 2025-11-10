import requests
from typing import Optional, Tuple

API_URL = "https://workflow.forwen.com/webhook/091a9d7b-36db-41cc-a13e-c6b1559d2fef/chat-with-document/documents"

def get_document_bytes(doc_id) -> Optional[Tuple[bytes, str, str]]:

    try:
        response = requests.get(f"{API_URL}/{doc_id}")
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Request failed for ID {doc_id}: {e}")
        return None

    file_name = response.headers.get("fileName")
    mime_type = response.headers.get("mimeType")
    file_bytes = response.content
        
    return file_bytes, file_name, mime_type


if __name__ == "__main__":

    document_id = "17"
    document = get_document_bytes(document_id)
    if document is None:
        print("Failed to get document.")
    else:
        file_bytes, file_name, mime_type = document
        print("File name:", file_name)
        print("MIME type:", mime_type)
        print("File size (bytes):", len(file_bytes))

        if file_name and file_bytes:
            with open(file_name, "wb") as f:
                f.write(file_bytes)
            print(f"File saved as {file_name}")
