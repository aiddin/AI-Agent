<template>
  <div class="main-container">
    <AISelectorBar @agent-selected="updateSelectedAgent" />
    <AIChatArea :selectedAgent="selectedAgent" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AISelectorBar from './AISelectorBar.vue'
import AIChatArea from './AIChatArea.vue'

const selectedAgent = ref(null)

const updateSelectedAgent = (agent) => {
  // Remove the n8n chat element from the DOM if it exists
  const n8nChatElement = document.getElementById('n8n-chat')
  if (n8nChatElement) {
    n8nChatElement.remove();
  }
  
  // Reset scroll position for all scrollable elements in the document
  const scrollableElements = document.querySelectorAll('*');
  scrollableElements.forEach(element => {
    // Check if the element is scrollable
    if (element.scrollHeight > element.clientHeight || 
        element.scrollWidth > element.clientWidth) {
      element.scrollTop = 0;
      element.scrollLeft = 0;
    }
  });
  
  // Update the selected agent
  selectedAgent.value = agent;
  
  // Scroll the window to the top
  window.scrollTo(0, 0);
}

</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #1c1c1c;
  font-family: 'Arial', sans-serif;
  position: relative;
  /* Needed for positioning child elements */
}
</style>
