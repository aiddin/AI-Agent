# Chatbot Components

This folder contains a set of reusable chatbot components built with Vue 3 and the @n8n/chat library.

## Structure

- `BaseChatBot.vue` - Base component that all specific chatbot implementations extend
- `chatbot-styles.css` - Shared styles for all chatbot components
- `chatbot-configs.js` - Configuration objects for each chatbot type
- `index.js` - Exports all components and configurations for easier imports

## Specific Chatbot Implementations

- `MortgageApplicationData.vue` - Chatbot for collecting mortgage application data
- `MortgageApplicationDocument.vue` - Chatbot for document uploads in mortgage applications
- `PetbackerCS.vue` - PetBacker customer support chatbot
- `PetSitterTrainer.vue` - Training tool for pet sitters
- `ProgramAdvisor.vue` - Academic program advisor chatbot

## Usage

### Importing Components

You can import specific components:

```js
import { MortgageApplicationData } from '@/components/AI Agent Component/chatbot'
```

Or import the base component and configurations to create custom chatbots:

```js
import { BaseChatBot } from '@/components/AI Agent Component/chatbot'
import { mortgageApplicationDataConfig } from '@/components/AI Agent Component/chatbot'
```

### Using Components

```vue
<template>
  <MortgageApplicationData />
</template>

<script setup>
import { MortgageApplicationData } from '@/components/AI Agent Component/chatbot'
</script>
```

### Creating a New Chatbot

1. Add a new configuration in `chatbot-configs.js`:

```js
export const newChatbotConfig = {
  webhookUrl: 'https://your-webhook-url',
  initialMessages: [
    'Welcome message'
  ],
  i18n: {
    en: {
      title: 'Your Chatbot Title',
      subtitle: "Your subtitle",
      getStarted: 'Start',
      inputPlaceholder: 'Type your message...',
      footer: ''
    }
  }
}
```

2. Create a new component file:

```vue
<template>
  <BaseChatBot 
    :config="config"
    alt-text="Your Alt Text" 
  />
</template>

<script setup>
import BaseChatBot from './BaseChatBot.vue'
import { newChatbotConfig } from './chatbot-configs.js'

const config = newChatbotConfig
</script>
```

3. Export the new component in `index.js`:

```js
export { default as NewChatbot } from './NewChatbot.vue'
