<template>
    <div class="flex flex-col h-full text-gray-800 overflow-hidden max-w-4xl mx-auto">
        <div class="flex-1 overflow-y-auto">
            <div class="flex flex-col items-center justify-center h-screen text-center text-gray-600 text-3xl p-5">
                <img src="/assets/images/welcome-robo.svg" alt="Placeholder Image" width="100" height="100" class="mb-4">
                <h1 class="font-bold">Welcome to Our Collective AI Agents</h1>
                <p class="mt-4 text-sm text-gray-500 text-left leading-relaxed">
                    In a rapidly evolving world, our AI agents are here to enhance efficiency and improve your
                    experience. Designed to automate tasks and provide insightful support, each agent adapts to your
                    specific needs.
                </p>
                <p class="mt-4 text-sm text-gray-500 text-left leading-relaxed">
                    Whether you need assistance with document verification, candidate scoring, or program rankings, our
                    AI agents are equipped to handle it all. Each agent is tailored to provide specialized support,
                    ensuring you get the most relevant and effective solutions for your needs.
                </p>
                <h3 class="text-lg font-semibold mt-5 dark:text-white-light flex items-center">
                    <IconCaretsDown class="rotate-90 mr-2" @click="store.toggleSidebar()"></IconCaretsDown>
                    Select an AI Agent to Begin
                </h3>
            </div>
        </div>
        <div class="circle circle1"></div>
        <div class="circle circle2"></div>
        <div class="circle circle3"></div>
        <div class="circle circle4"></div>
    </div>
</template>

<script setup lang="ts">
import IconCaretsDown from '@/components/icon/icon-carets-down.vue'
import { useAppStore } from '@/stores/index'
const store = useAppStore()
</script>

<style scoped>
h1, p, h3 {
    position: relative;
    z-index: 1; /* Ensure text is above the gradient blurred background */
}

.circle {
    position: fixed;
    border-radius: 50%;
    background: linear-gradient(270deg, #9EA3FF, #27D5FC);
    filter: blur(150px); /* Reduced blur for subtlety */
    opacity: 0.4; /* Lower opacity for a more delicate effect */
}

.circle1 {
    width: 600px;
    height: 500px;
    margin-left: 100px;
    animation: moveCircle1 15s linear infinite; /* Slower animation */
    left: 0; /* Position on the left */
    bottom: 0; /* Position at the bottom */
}

.circle2 {
    width: 300px;
    height: 300px;
    animation: moveCircle2 3s linear infinite; /* Adjusted speed */
    right: 0; /* Position on the right */
    bottom: 0; /* Position at the bottom */
}

.circle3 {
    width: 400px;
    height: 400px;
    animation: moveCircle3 10s linear infinite; /* New circle */
    left: 5%; /* Centered */
    bottom: 10%; /* Slightly above bottom */
    transform: translateX(-50%);
}

.circle4 {
    width: 20px;
    height: 250px;
    animation: moveCircle4 8s linear infinite; /* New circle */
    right: 5%; /* Position on the right */
    bottom: 20%; /* Slightly higher */
}

@keyframes moveCircle1 {
    0%, 100% {
        transform: translate(-50%, 0); /* Stay in place */
    }
    50% {
        transform: translate(-50%, 10vh); /* Move slightly up */
    }
}

@keyframes moveCircle2 {
    0%, 100% {
        transform: translate(50%, 0); /* Stay in place */
    }
    50% {
        transform: translate(50%, 10vh); /* Move slightly up */
    }
}

@keyframes moveCircle3 {
    0%, 100% {
        transform: translate(0, 0); /* Stay in place */
    }
    50% {
        transform: translate(0, -10vh); /* Move slightly up */
    }
}

@keyframes moveCircle4 {
    0%, 100% {
        transform: translate(0, 0); /* Stay in place */
    }
    50% {
        transform: translate(0, 5vh); /* Move slightly down */
    }
}
</style>
