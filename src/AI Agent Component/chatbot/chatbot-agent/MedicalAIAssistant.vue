<template>
  <BaseChatBot
    :config="config"
    alt-text="Medical AI Assistant Background"
    background-theme="medical"
  />
</template>

<script setup>
import BaseChatBot from './BaseChatBot.vue'
import { medicalAIAssistantConfig } from '../chatbot-configs.js'

const config = medicalAIAssistantConfig
</script>
