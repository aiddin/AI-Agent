/**
 * Chatbot configurations for different use cases
 */

export const mortgageApplicationDataConfig = {
  webhookUrl: 'https://n8n.forwen.com/webhook/5bf8b743-6eb5-4c6c-b407-1022a67faf9f/chat',
  initialMessages: [
    'Hello! I\'m here to help you assess your mortgage financing eligibility. I\'ll guide you step by step to collect all the necessary information. Let\'s get started!'
  ],
  i18n: {
    en: {
      title: 'Mortgage Application Assistant',
      subtitle: "Provide your details to complete the application form.",
      getStarted: 'Start',
      inputPlaceholder: 'Type your message...',
      footer: ''
    }
  }
}

export const mortgageApplicationDocumentConfig = {
  webhookUrl: 'https://n8n.forwen.com/webhook/7d747854-a9bf-4066-b487-f62d53be5dfc/chat',
  allowFileUploads: true,
  allowedFilesMimeTypes: [
    'image/*',
    'application/pdf'
  ],
  initialMessages: [
    'Hello! I\'m here to help guide you through submitting the required documents for your mortgage application. Let\'s get started!'
  ],
  i18n: {
    en: {
      title: 'Mortgage Application Assistant',
      subtitle: "Easily upload your documents for a smooth mortgage application process",
      getStarted: 'Start',
      inputPlaceholder: 'Type your message...',
      footer: ''
    }
  }
}

export const petbackerCSConfig = {
  webhookUrl: 'https://n8n.forwen.com/webhook/57b02c6b-acf2-4b7d-bbd9-8a1047078b7f/chat',
  initialMessages: [
    'Hello! I\'m PetBacker\'s AI Customer Support. How can I assist you today?'
  ],
  webhookConfig: {
    method: 'POST',
    headers: {}
  },
  mode: 'window',
  i18n: {
    en: {
      title: 'PetBacker AI Customer Support',
      subtitle: "",
      getStarted: 'Start',
      inputPlaceholder: 'Type your message...',
      footer: ''
    }
  }
}

export const petSitterTrainerConfig = {
  webhookUrl: 'https://n8n.forwen.com/webhook/7d747854-a9bf-4066-b487-f62d53be5dfc/chat',
  initialMessages: [
    'Welcome to PetBacker Sitter Trainer AI! Practice handling real pet owner messages, get feedback, and improve your communication and service skills. Let\'s get started!'
  ],
  i18n: {
    en: {
      title: 'Communication Skill Level 1',
      subtitle: "Improve your negotiation skills with pet owners.",
      getStarted: 'Start Training',
      inputPlaceholder: 'Type your message...',
      footer: ''
    }
  }
}

export const programAdvisorConfig = {
  webhookUrl: 'https://n8n.forwen.com/webhook/515c5cfb-da0a-4de8-b1e8-65f3b0cfe5aa/chat',
  mode: 'window',
  showWelcomeScreen: false,
  defaultLanguage: 'en',
  allowFileUploads: true,
  allowedFilesMimeTypes: [
    'image/*',
    'application/pdf'
  ],
  initialMessages: [
    'Hi! I\'m UTP\'s AI Program Advisor, here to help you find the best program at UTP. Let\'s get started!'
  ],
  i18n: {
    en: {
      title: 'Program Advisor',
      subtitle: " Share your academic results, and I'll help recommend the best program for you.",
      getStarted: 'Start',
      inputPlaceholder: 'Type your message...',
      footer: ''
    }
  }
}
