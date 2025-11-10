import axios from 'axios'

const BASE_URL = 'https://workflow.forwen.com/webhook'
const CHAT_API_URL = `${BASE_URL}/chat-with-document`
const PROCESS_API_URL = `${BASE_URL}/f667cc0e-5036-4aa3-8353-496023a81ad0/chat-with-document`
const GET_DOC_API_URL = `${BASE_URL}/091a9d7b-36db-41cc-a13e-c6b1559d2fef/chat-with-document`

// Types
export interface Document {
  id: number
  name: string
  size?: number
  processed?: boolean
}

export interface ChatResponse {
  message: string
  suggested_questions: string[]
  sessionId: string
}

export interface UploadResponse {
  document_id: number
}

export interface ProcessResponse {
  success: boolean
}

// Get all documents from database
export const getAllDocuments = async (): Promise<Document[]> => {
  try {
    console.log('Fetching documents from:', `${CHAT_API_URL}/documents`)
    const response = await axios.get(`${CHAT_API_URL}/documents`)
    console.log('Documents fetched successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to get documents from database:', error)
    // Return empty array if fetch fails instead of throwing
    return []
  }
}

// Upload a document
export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post(`${CHAT_API_URL}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Failed to upload document:', error)
    throw error
  }
}

// Process a document
export const processDocument = async (documentId: number): Promise<ProcessResponse> => {
  try {
    const response = await axios.post(`${PROCESS_API_URL}/process-document/${documentId}`)
    return response.data
  } catch (error) {
    console.error('Failed to process document:', error)
    throw error
  }
}

// Get document by ID (returns file bytes with metadata)
export const getDocumentById = async (documentId: number): Promise<{ blob: Blob; fileName: string; mimeType: string }> => {
  try {
    console.log('Fetching document by ID:', documentId, 'from:', `${GET_DOC_API_URL}/documents/${documentId}`)
    const response = await axios.get(`${GET_DOC_API_URL}/documents/${documentId}`, {
      responseType: 'blob',
    })

    // Extract metadata from response headers
    const fileName = response.headers['filename'] || response.headers['fileName'] || 'document'
    const mimeType = response.headers['mimetype'] || response.headers['mimeType'] || response.headers['content-type'] || 'application/octet-stream'

    console.log('Document fetched:', { fileName, mimeType, size: response.data.size })

    return {
      blob: response.data,
      fileName,
      mimeType
    }
  } catch (error) {
    console.error('Failed to get document by ID:', error)
    throw error
  }
}

// Initialize chat session
export const initializeChat = async (documentId: number): Promise<ChatResponse> => {
  try {
    const payload = { documentId }
    console.log('Initializing chat with payload:', payload)
    console.log('POST to:', `${CHAT_API_URL}/chat`)

    const response = await axios.post(`${CHAT_API_URL}/chat`, payload)

    console.log('Chat initialized - Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to initialize chat:', error)
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
    }
    throw error
  }
}

// Send chat message
export const sendChatMessage = async (
  sessionId: string,
  documentId: number,
  chatInput: string
): Promise<ChatResponse> => {
  try {
    const payload = {
      sessionId,
      documentId,
      chatInput,
    }
    console.log('Sending chat message with payload:', payload)
    console.log('POST to:', `${CHAT_API_URL}/chat`)

    const response = await axios.post(`${CHAT_API_URL}/chat`, payload)

    console.log('Chat response received:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to send chat message:', error)
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
    }
    throw error
  }
}
