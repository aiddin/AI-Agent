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

/* Hide "powered by n8n" branding */
[class*="powered-by"],
[class*="branding"],
[class*="footer"],
.n8n-chat [class*="powered"],
.n8n-chat [class*="brand"],
[data-chat] [class*="powered"],
[data-chat] [class*="brand"],
[title*="n8n"],
[alt*="powered by"],
[alt*="n8n"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
