<template>
  <div class="chatbot">
    <div class="chat-content" ref="chatContainer">
      <div v-if="selectedAgent === 'pet-trainer'">
        <MessageAI />
      </div>
      <div v-if="selectedAgent === 'customer-support'">
        <PetbackerCS />
      </div>
      <div v-if="selectedAgent === 'mortgage-assistant-document'">
        <MortgageApplicationDocument />
      </div>
      <div v-if="selectedAgent === 'mortgage-assistant'">
        <MortgageApplicationData />
      </div>
      <div v-if="selectedAgent === 'medical-assistant'">
        <MedicalAIAssistant />
      </div>
      <div v-if="selectedAgent === 'uni-program-advisor'">
        <UniProgramAdvisor />
      </div>
      <div v-if="selectedAgent === 'applicant-scoring'">
        <ApplicantScoring />
      </div>
      <div v-if="selectedAgent === 'purchase-order'">
        <PurchaseOrderViewer />
      </div>
      <div v-if="selectedAgent === 'data-cleansing'">
        <DataCleansing />
      </div>
      <div v-if="selectedAgent === 'issue-classification'">
        <IssueClassification />
      </div>
      <div v-if="selectedAgent === 'receipt-claim'">
        <ReceiptClaim />
      </div>
      <div v-if="selectedAgent === 'document-chat'">
        <DocumentChat />
      </div>
      <div v-if="selectedAgent === 'accounts-analysis'">
        <AccountsAnalysis />
      </div>
      <div v-if="selectedAgent === null" class="welcome-message">
        <h2>Please select an AI agent to start.</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, nextTick } from 'vue'
import MessageAI from './chatbot/chatbot-agent/PetSitterTrainer.vue'
import PetbackerCS from './chatbot/chatbot-agent/PetbackerCS.vue'
import MortgageApplicationDocument from './chatbot/chatbot-agent/MortgageApplicationDocument.vue'
import MortgageApplicationData from './chatbot/chatbot-agent/MortgageApplicationData.vue'
import MedicalAIAssistant from './chatbot/chatbot-agent/MedicalAIAssistant.vue'
import UniProgramAdvisor from './chatbot/chatbot-agent/UniProgramAdvisor.vue'
import ApplicantScoring from './workflow/Applicant_Scoring/ApplicantScoring.vue'
import PurchaseOrderViewer from './workflow/Purchase Order/PurchaseOrderViewer.vue'
import DataCleansing from './workflow/Data Cleansing/DataCleansing.vue'
import IssueClassification from './workflow/Issue_Classification/IssueClassification.vue'
import ReceiptClaim from './workflow/Receipt Claim Analyzer/ReceiptClaim.vue'
import DocumentChat from './workflow/Document Chat/DocumentChat.vue'
import AccountsAnalysis from './workflow/Accounts Analysis/AccountsAnalysis.vue'

// Define props
const props = defineProps({
  selectedAgent: {
    type: String,
    default: null,
  },
})

const chatContainer = ref(null) // Reference for chat container

// Function to scroll all scrollable elements to the top
const scrollAllToTop = () => {
  // First, scroll the main chat container
  if (chatContainer.value) {
    chatContainer.value.scrollTop = 0
  }

  // Find all scrollable elements within the chat content
  const scrollableElements = document.querySelectorAll('.chat-content *')
  scrollableElements.forEach(element => {
    // Check if the element is scrollable
    if (element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth) {
      element.scrollTop = 0
      element.scrollLeft = 0
    }
  })

  // Also look for n8n chat elements that might be added dynamically
  const n8nChatElements = document.querySelectorAll('.n8n-chat-window, .n8n-chat-messages')
  n8nChatElements.forEach(element => {
    element.scrollTop = 0
  })
}

// Watch for changes to selectedAgent
watch(
  () => props.selectedAgent,
  async (newAgent) => {
    if (newAgent) {
      await nextTick()

      // Scroll all elements to the top
      scrollAllToTop()

      // Set a small timeout to ensure dynamic content is loaded
      setTimeout(() => {
        scrollAllToTop()
      }, 100)
    }
  }
);

</script>

<style scoped>
.chatbot {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  color: #333;
  overflow: hidden;
  width: 100%;
}

/* Desktop layout */
@media (min-width: 768px) {
  .chatbot {
    width: calc(100% - 290px);
    margin-left: 290px;
  }
}

/* Mobile layout */
@media (max-width: 767px) {
  .chatbot {
    padding-top: 56px;
    /* Height of mobile header */
  }
}

.chat-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chat-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.agent-info {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
}

/* Mobile adjustments for chat content */


.message {
  padding: 12px 15px;
  border-radius: 8px;
  background-color: #f0f0f0;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  color: #333;
}

.chat-input {
  display: flex;
  padding: 15px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
}

.chat-input input {
  flex: 1;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-right: 10px;
  background-color: #f9f9f9;
  color: #333;
  font-size: 0.95rem;
}

.chat-input input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.send-btn {
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background-color: #4f46e5;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-btn:hover {
  background-color: #4338ca;
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #666;
  padding: 20px;
}

.welcome-message h2 {
  font-size: 1.5rem;
  /* Larger font size */
  font-weight: bold;
  /* Bold text */
  color: #333;
  /* Darker text color */
}

/* N8N Chat Styling - Smaller Text */
:deep(.n8n-chat),
:deep(.n8n-chat *),
:deep(.n8n-chat-window),
:deep(.n8n-chat-window *),
:deep(.n8n-chat-messages),
:deep(.n8n-chat-messages *),
:deep(.n8n-chat-message),
:deep(.n8n-chat-message *),
:deep(.n8n-chat-text),
:deep(.n8n-chat-text *),
:deep(n8n-chat),
:deep(n8n-chat *) {
  font-size: 12px !important;
  line-height: 1.4 !important;
}
</style>
