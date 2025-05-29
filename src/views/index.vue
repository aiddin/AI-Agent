<template>
     <div class="chatbot">
        <div class="chat-content" ref="chatContainer">
    <div class="welcome-message">
        <h1>Please select an AI agent to start.</h1>
    </div>
    </div>
    </div>
</template>
<style>
.welcome-message {
    font-size: xx-large;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: #666;
    padding: 20px;
}
.chatbot {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  color: #333;
  overflow: hidden;
  width: 100%;
}
.chat-content {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
}
</style>
