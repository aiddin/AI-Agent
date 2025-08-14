<template>
  <div class="chatbot-container">
    <div class="background-wrapper">
      <img
        :src="isMobile ? mobileBackgroundImage : desktopBackgroundImage"
        :alt="altText"
        class="background-image" :style="{ marginTop: isMobile ? '15px' : '0px' }"/>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { createChat } from '@n8n/chat'
import '@n8n/chat/style.css'

// Import all background images
import AIChatbotBackground from '@/assets/css/images/AIAgentSelector/AIChatbotBackground.svg'
import AIChatbotBackgroundMobile from '@/assets/css/images/AIAgentSelector/AIChatbotBackgroundMobile.svg'
import MortgageBackground from '@/assets/css/images/AIAgentSelector/MortgageBackground.png'
import MortgageBackgroundMobile from '@/assets/css/images/AIAgentSelector/MortgageBackgroundMobile.png'
import PetbackerBackground from '@/assets/css/images/AIAgentSelector/PetbackerBackground.png'
import PetbackerBackgroundMobile from '@/assets/css/images/AIAgentSelector/PetbackerBackgroundMobile.png'
import TrainerBackground from '@/assets/css/images/AIAgentSelector/TrainerBackground.svg'
import TrainerBackgroundMobile from '@/assets/css/images/AIAgentSelector/TrainerBackgroundMobile.svg'
import AdvisorBackground from '@/assets/css/images/AIAgentSelector/AdvisorBackground.png'
import AdvisorBackgroundMobile from '@/assets/css/images/AIAgentSelector/AdvisorBackgroundMobile.png'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  altText: {
    type: String,
    default: 'Chatbot Background'
  },
  backgroundTheme: {
    type: String,
    default: 'default'
  }
})

const chatService = ref(null)

// Computed property to check if the view is mobile
const isMobile = computed(() => {
  return window.innerWidth < 768; // Adjust the threshold as needed
})

// Computed properties for background images based on theme
const desktopBackgroundImage = computed(() => {
  const backgrounds = {
    default: AIChatbotBackground,
    mortgage: MortgageBackground,
    petbacker: PetbackerBackground,
    trainer: TrainerBackground,
    advisor: AdvisorBackground
  }
  return backgrounds[props.backgroundTheme] || backgrounds.default
})

const mobileBackgroundImage = computed(() => {
  const backgrounds = {
    default: AIChatbotBackgroundMobile,
    mortgage: MortgageBackgroundMobile,
    petbacker: PetbackerBackgroundMobile,
    trainer: TrainerBackgroundMobile,
    advisor: AdvisorBackgroundMobile
  }
  return backgrounds[props.backgroundTheme] || backgrounds.default
})

onMounted(() => {
  chatService.value = createChat(props.config)
})
</script>

<style src="src/assets/css/chatbot-styles.css" scoped></style>

<style>
/* Override n8n chat font size - must be global to affect n8n components */
.n8n-chat,
.n8n-chat *,
[class*="n8n-chat"] *,
[data-chat] *,
[data-n8n-chat] * {
  font-size: 12px !important;
  line-height: 1.4 !important;
}

/* Hide "powered by n8n" branding - more specific to avoid hiding input */
.n8n-chat a[href*="n8n.io"],
.n8n-chat img[alt*="powered by"],
.n8n-chat img[alt*="n8n"],
.n8n-chat [class*="powered-by"]:not(input):not(textarea),
.n8n-chat [class*="branding"]:not(input):not(textarea) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
}

/* Loading chat styles */
.chat-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: white;
  z-index: 10;
}

.loading-messages {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.loading-message {
  background: #f0f0f0;
  padding: 12px 16px;
  border-radius: 18px;
  margin-bottom: 12px;
  max-width: 80%;
  font-size: 12px;
  line-height: 1.4;
}

.loading-input {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.chat-input-field {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 12px;
  outline: none;
}

.chat-input-field:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.send-button {
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
}

.send-button:hover {
  background: #4338ca;
}
</style>
