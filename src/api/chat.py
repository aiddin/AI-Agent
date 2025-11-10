import requests

API_CHAT_URL = "https://workflow.forwen.com/webhook/chat-with-document/chat"

def initialize_chat(document_id):

    payload = {
        "documentId": document_id
    }
    try:
        response = requests.post(API_CHAT_URL, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None

def chat(session_id, document_id, chat_input):

    payload = {
        "sessionId": session_id,
        "documentId": document_id,
        "chatInput": chat_input
    }
    try:
        response = requests.post(API_CHAT_URL, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None

if __name__ == "__main__":

    # Initialize chat
    document_id = 33
    response = initialize_chat(document_id)
    print(response)

# Example output:
# {
#     'message': 'Hi there! I can see this is a bank statement from Public Bank. What would you like to know about your account activity?', 
#     'suggested_questions': ["What's my account balance?", 'Show me recent transactions', 'How many debits and credits were there?'], 
#     'sessionId': '19a685327cd7be2a3d818ce3404'
# }

    # Chat
    session_id = response["sessionId"]
    chat_input = "What is my account balance?"
    response = chat(session_id, document_id, chat_input)
    print(response)

# Example output:
# {
#     'message': 'Your account closing balance is RM 14,290.63 as of the statement date (October 2, 2025).', 
#     'suggested_questions': ['What were my largest transactions this month?', 'How much did I spend in total?', 'Show me all my deposits'], 
#     'sessionId': '19a685327cd7be2a3d818ce3404'
# }
