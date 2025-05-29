<template>
  <BaseChatBot 
    :config="config"
    alt-text="Mortgage Application Background"
    background-theme="mortgage"
  />
</template>

<script setup>
import BaseChatBot from './BaseChatBot.vue'
import { mortgageApplicationDataConfig } from '../chatbot-configs.js'

const config = mortgageApplicationDataConfig
</script>
