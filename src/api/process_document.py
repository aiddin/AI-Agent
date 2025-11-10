import requests

API_URL = "https://workflow.forwen.com/webhook/f667cc0e-5036-4aa3-8353-496023a81ad0/chat-with-document/process-document"

def process_document(doc_id):
    """
    Call the process-document API with the document ID in the URL path.
    """
    url = f"{API_URL}/{doc_id}"

    try:
        response = requests.post(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Request failed for document ID {doc_id}: {e}")
        return None

    try:
        return response.json()
    except ValueError:
        print("Response is not valid JSON")
        return None


if __name__ == "__main__":

    document_id = "33"
    process_status = process_document(document_id)
    print(process_status)

# Example output:
# {'success': True/False}
