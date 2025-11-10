import requests

API_URL = "https://workflow.forwen.com/webhook/chat-with-document/documents"

def get_all_documents():

    try:
        response = requests.get(API_URL)
        response.raise_for_status()
    except requests.RequestException as e:
        print("Request failed:", e)
        return []

    try:
        data = response.json()
    except ValueError:
        print("Invalid JSON response")
        return []
    return data

# Example usage
if __name__ == "__main__":
    docs = get_all_documents()
    print(docs)

# Example output:
# [
#   {
#     "id": 16,
#     "name": "4.2 Soalan-Soalan Lazim FAQs for Pekeliling 1.4.pdf"
#   },
#   {
#     "id": 17,
#     "name": "floor-plan.jpg"
#   },
#   {
#     "id": 18,
#     "name": "refer-letter.jpg"
#   }
# ]
