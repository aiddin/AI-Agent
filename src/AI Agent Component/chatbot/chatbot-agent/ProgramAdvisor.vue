<template>
  <BaseChatBot 
    :config="config"
    alt-text="Program Advisor Background"
    background-theme="advisor"
  />
</template>

<script setup>
import BaseChatBot from './BaseChatBot.vue'
import { programAdvisorConfig } from '../chatbot-configs.js'

const config = programAdvisorConfig
</script>
