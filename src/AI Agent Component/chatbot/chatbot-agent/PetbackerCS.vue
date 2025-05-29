<template>
  <BaseChatBot 
    :config="config"
    alt-text="PetBacker Customer Support Background"
    background-theme="petbacker"
  />
</template>

<script setup>
import BaseChatBot from './BaseChatBot.vue'
import { petbackerCSConfig } from '../chatbot-configs.js'

const config = petbackerCSConfig
</script>
