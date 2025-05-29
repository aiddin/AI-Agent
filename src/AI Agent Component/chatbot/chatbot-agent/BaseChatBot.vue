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
import AIChatbotBackground from '@/assets/images/AIAgentSelector/AIChatbotBackground.svg'
import AIChatbotBackgroundMobile from '@/assets/images/AIAgentSelector/AIChatbotBackgroundMobile.svg'
import MortgageBackground from '@/assets/images/AIAgentSelector/MortgageBackground.png'
import MortgageBackgroundMobile from '@/assets/images/AIAgentSelector/MortgageBackgroundMobile.png'
import PetbackerBackground from '@/assets/images/AIAgentSelector/PetbackerBackground.png'
import PetbackerBackgroundMobile from '@/assets/images/AIAgentSelector/PetbackerBackgroundMobile.png'
import TrainerBackground from '@/assets/images/AIAgentSelector/TrainerBackground.svg'
import TrainerBackgroundMobile from '@/assets/images/AIAgentSelector/TrainerBackgroundMobile.svg'
import AdvisorBackground from '@/assets/images/AIAgentSelector/AdvisorBackground.png'
import AdvisorBackgroundMobile from '@/assets/images/AIAgentSelector/AdvisorBackgroundMobile.png'

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

<style src="src/assets/chatbot-styles.css" scoped></style>
