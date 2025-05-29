<template>
  <BaseChatBot 
    :config="config"
    alt-text="Mortgage Document Upload Background"
    background-theme="mortgage"
  />
</template>

<script setup>
import BaseChatBot from './BaseChatBot.vue'
import { mortgageApplicationDocumentConfig } from '../chatbot-configs.js'

const config = mortgageApplicationDocumentConfig
</script>
