<template>
  <BaseChatBot
    :config="config"
    alt-text="University Program Advisor Background"
    background-theme="advisor"
  />
</template>

<script setup>
import BaseChatBot from './BaseChatBot.vue'
import { uniProgramAdvisorConfig } from '../chatbot-configs.js'

const config = uniProgramAdvisorConfig
</script>
