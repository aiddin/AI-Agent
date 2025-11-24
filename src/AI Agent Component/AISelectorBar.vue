<template>
  <div>
    <!-- Mobile Header with Hamburger Menu -->
    <div class="mobile-header" v-if="isMobile">
      <h1 class="mobile-title">AI AGENT</h1>
      <button class="hamburger-button" @click="toggleDrawer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Sidebar (Desktop always visible, Mobile as drawer) -->
    <div class="sidebar" :class="{ 'mobile-drawer': isMobile, 'open': drawerOpen }">
      <!-- Mobile Close Button -->
      <div class="mobile-drawer-header" v-if="isMobile">
        <h1 class="title">AI AGENT</h1>
        <button class="close-button" @click="closeDrawer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Desktop Title (hidden on mobile) -->
      <h1 class="title" v-if="!isMobile">AI AGENT</h1>

      <div class="section">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          Chatbot
        </div>
        <div class="chatbot-list">
          <div class="card" @click="selectAgentAndCloseDrawer('customer-support')"
            :class="{ active: selectedAgent === 'customer-support' }">
            PB customer support

            <span class="card-description">access to FAQs and APIs for booking and chat retrieval</span>
            <span class="category-tag cs">Customer Support</span>
          </div>
          <div class="card" @click="selectAgentAndCloseDrawer('program-advisor')"
            :class="{ active: selectedAgent === 'program-advisor' }">
            Program advisor
            <span class="card-description">course & program advisor</span>
            <span class="category-tag education">Education</span>
          </div>
          <div class="card" @click="selectAgentAndCloseDrawer('pet-trainer')"
            :class="{ active: selectedAgent === 'pet-trainer' }">
            Pet sitter trainer
            <span class="card-description">visualize user behavior and interaction metrics</span>

            <span class="category-tag education">Education</span>
          </div>
          <div class="card" @click="selectAgentAndCloseDrawer('mortgage-assistant')"
            :class="{ active: selectedAgent === 'mortgage-assistant' }">
            Mortgage application assistant

            <span class="card-description">tools for managing user accounts and settings</span>
            <span class="category-tag finance">Finance</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          Workflow
        </div>
        <div class="workflow-list">
          <div class="card" @click="selectAgentAndCloseDrawer('applicant-scoring')"
            :class="{ active: selectedAgent === 'applicant-scoring' }">
            UTP applicant scoring
            <span class="card-description">Applicant Scoring created for Universiti Teknologi Petronas use</span>
            <span class="category-tag misc">Misc</span>

          </div>
          <div class="card" @click="selectAgentAndCloseDrawer('issue-classification')"
            :class="{ active: selectedAgent === 'issue-classification' }">
            Petbacker Issue classification
            <span class="card-description">Issue classification AI for Petbacker</span>
            <span class="category-tag misc">Misc</span>

          </div>
          <div class="card" @click="selectAgentAndCloseDrawer('purchase-order')"
            :class="{ active: selectedAgent === 'purchase-order' }">
            Purchase order information extraction
            <span class="card-description">Automatically extract and display purchase order details from
              documents</span>
            <span class="category-tag ecommerce">E-commerce</span>

          </div>
          <div class="card" @click="selectAgentAndCloseDrawer('data-cleansing')"
            :class="{ active: selectedAgent === 'data-cleansing' }">
            Data cleansing
            <span class="card-description">Compares data from two database sources and an ID card, then consolidates into one</span>
            <span class="category-tag misc">Misc</span>

          </div>
          <div class="card" @click="selectAgentAndCloseDrawer('receipt-claim')"
            :class="{ active: selectedAgent === 'receipt-claim' }"> Receipt claim analyzer
            <span class="card-description">Analyse receipt to make claim to HR</span>
                        <span class="category-tag finance">Finance</span>

          </div>
          <div class="card" @click="selectAgentAndCloseDrawer('document-chat')"
            :class="{ active: selectedAgent === 'document-chat' }">
            Document Chat
            <span class="card-description">Upload documents and chat with AI about their content</span>
            <span class="category-tag misc">Misc</span>
          </div>
          <div class="card" @click="selectAgentAndCloseDrawer('accounts-analysis')"
            :class="{ active: selectedAgent === 'accounts-analysis' }">
            Accounts Analysis
            <span class="card-description">Upload bank statements and analyze transactions with CSV export</span>
            <span class="category-tag finance">Finance</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay for mobile drawer -->
    <div v-if="isMobile && drawerOpen" class="mobile-overlay" @click="closeDrawer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const selectedAgent = ref(null)
const drawerOpen = ref(false)
const isMobile = ref(false)

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Toggle drawer for mobile
const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

// Close drawer
const closeDrawer = () => {
  drawerOpen.value = false
}

// Select agent and close drawer on mobile
const selectAgentAndCloseDrawer = (agent) => {
  selectedAgent.value = agent
  emit('agent-selected', agent)
  if (isMobile.value) {
    closeDrawer()
  }
}

// Add resize event listener
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// Remove resize event listener
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const emit = defineEmits()
</script>
<style scoped>
/* Mobile Header */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  color: white;
  padding: 12px 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  height: 56px;
}

.mobile-title {
  font-size: 1.25rem;
  margin: 0;
}

.hamburger-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
}

/* Mobile Drawer Header */
.mobile-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
}

/* Sidebar - Desktop & Mobile */
.sidebar {
  width: 290px;
  background-color: #1e1e1e;
  color: white;
  padding: 0;
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 30;
  transition: transform 0.3s ease;
}

/* Mobile Drawer */
.mobile-drawer {
  transform: translateX(-100%);
  width: 85%;
  max-width: 320px;
}

.mobile-drawer.open {
  transform: translateX(0);
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 20;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 20px 0 30px 20px;
  color: #ffffff;
}

.chatbot-list,
.workflow-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #a0a0a0;
  margin-bottom: 5px;
}

.section-title svg {
  margin-right: 10px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
  color: #e0e0e0;
  position: relative;
}

.card:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.card.active {
  background-color: rgba(255, 255, 255, 0.15);
}

.card-description {
  font-size: 0.75rem;
  color: #888;
  margin-top: 2px;
  display: block;
}

.category-tag {
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
  display: inline-block;
}

.category-tag.education {
  background-color: #2c5282;
  color: #ebf8ff;
}

.category-tag.finance {
  background-color: #2f855a;
  color: #e6fffa;
}

.category-tag.misc {
  background-color: #6b46c1;
  color: #f5f0ff;
}

.category-tag.cs {
  background-color: #0082fc;
  color: #f5f0ff;
}

.category-tag.ecommerce {
  background-color: #c53030;
  color: #fff5f5;
}

::-webkit-scrollbar {
  display: none;
}

/* Media Queries */
@media (min-width: 768px) {
  .sidebar {
    transform: translateX(0);
  }
}
</style>
