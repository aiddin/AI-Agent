<template>
  <BaseChatBot 
    :config="config"
    alt-text="Pet Sitter Trainer Background"
    background-theme="trainer"
  />
</template>

<script setup>
import BaseChatBot from './BaseChatBot.vue'
import { petSitterTrainerConfig } from '../chatbot-configs.js'

const config = petSitterTrainerConfig
</script>
