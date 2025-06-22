<template>
    <div class="flex flex-col h-full text-gray-800 overflow-hidden max-w-4xl mx-auto relative">
        <!-- New Enhanced Animation System -->
        <div class="animation-canvas">
            <!-- Named Floating Gradient Balls -->
            <div class="orb orb-azure-dream orb-1" data-name="Azure Dream"></div>
            <div class="orb orb-cyan-whisper orb-2" data-name="Cyan Whisper"></div>
            <div class="orb orb-violet-galaxy orb-3" data-name="Violet Galaxy"></div>
            <div class="orb orb-sapphire-mist orb-4" data-name="Sapphire Mist"></div>
            <div class="orb orb-ocean-breeze orb-5" data-name="Ocean Breeze"></div>
            
            <!-- Dynamic Gradient Shapes -->
            <div class="gradient-shape shape-1"></div>
            <div class="gradient-shape shape-2"></div>
            <div class="gradient-shape shape-3"></div>
            
            <!-- Background Texture -->
            <div class="texture-overlay"></div>
        </div>

        <div class="flex-1 overflow-y-auto relative z-20">
            <div class="flex flex-col items-center justify-center h-screen text-center text-gray-600 text-3xl p-5">
                <div class="content-container">
                    <div class="image-wrapper mb-6">
                        <img src="/assets/images/welcome-robo.svg" alt="AI Robot" width="100" height="100" class="hero-image">
                        <div class="image-aura"></div>
                    </div>
                    
                    <h1 class="hero-title font-bold mb-6">Welcome to Our Collective AI Agents</h1>
                    
                    <div class="text-content max-w-2xl">
                        <p class="description-text mt-4 text-sm text-gray-500 text-left leading-relaxed reveal-1">
                            In a rapidly evolving world, our AI agents are here to enhance efficiency and improve your
                            experience. Designed to automate tasks and provide insightful support, each agent adapts to your
                            specific needs.
                        </p>
                        <p class="description-text mt-4 text-sm text-gray-500 text-left leading-relaxed reveal-2">
                            Whether you need assistance with document verification, candidate scoring, or program rankings, our
                            AI agents are equipped to handle it all. Each agent is tailored to provide specialized support,
                            ensuring you get the most relevant and effective solutions for your needs.
                        </p>
                    </div>
                    
                    <div class="cta-section mt-8 reveal-3">
                        <button class="cta-button" @click="store.toggleSidebar()">
                            <div class="cta-content">
                                <IconCaretsDown class="cta-icon"></IconCaretsDown>
                                <span class="cta-text">Select an AI Agent to Begin</span>
                            </div>
                            <div class="cta-glow"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import IconCaretsDown from '@/components/icon/icon-carets-down.vue'
import { useAppStore } from '@/stores/index'
const store = useAppStore()
</script>

<style scoped>
/* Subtle floating animations for each named gradient ball */
@keyframes azureDreamFloat {
    0%, 100% {
        transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
        opacity: 0.3;
    }
    25% {
        transform: translate3d(60px, -80px, 0) scale(1.15) rotate(90deg);
        opacity: 0.45;
    }
    50% {
        transform: translate3d(-45px, -120px, 0) scale(0.9) rotate(180deg);
        opacity: 0.5;
    }
    75% {
        transform: translate3d(-90px, -30px, 0) scale(1.1) rotate(270deg);
        opacity: 0.35;
    }
}

@keyframes cyanWhisperFloat {
    0%, 100% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0.35;
    }
    33% {
        transform: translate3d(-70px, -60px, 0) scale(0.95);
        opacity: 0.48;
    }
    66% {
        transform: translate3d(85px, -100px, 0) scale(1.2);
        opacity: 0.25;
    }
}

@keyframes violetGalaxyFloat {
    0%, 100% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0.25;
    }
    20% {
        transform: translate3d(100px, -50px, 0) scale(1.25);
        opacity: 0.4;
    }
    40% {
        transform: translate3d(-60px, -140px, 0) scale(0.85);
        opacity: 0.5;
    }
    60% {
        transform: translate3d(-110px, -75px, 0) scale(1.15);
        opacity: 0.45;
    }
    80% {
        transform: translate3d(40px, -110px, 0) scale(0.95);
        opacity: 0.3;
    }
}

@keyframes sapphireMistFloat {
    0%, 100% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0.3;
    }
    50% {
        transform: translate3d(50px, -90px, 0) scale(1.1);
        opacity: 0.4;
    }
}

@keyframes oceanBreezeFloat {
    0%, 100% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0.32;
    }
    25% {
        transform: translate3d(-80px, -65px, 0) scale(1.08);
        opacity: 0.42;
    }
    50% {
        transform: translate3d(70px, -120px, 0) scale(0.92);
        opacity: 0.5;
    }
    75% {
        transform: translate3d(30px, -40px, 0) scale(1.12);
        opacity: 0.38;
    }
}

/* Dynamic Gradient Shape Morphing */
@keyframes shapeShift {
    0%, 100% {
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        transform: rotate(0deg) scale(1);
        opacity: 0.12;
    }
    20% {
        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
        transform: rotate(72deg) scale(1.1);
        opacity: 0.18;
    }
    40% {
        border-radius: 50% 30% 60% 70% / 30% 50% 40% 70%;
        transform: rotate(144deg) scale(0.95);
        opacity: 0.15;
    }
    60% {
        border-radius: 70% 50% 40% 60% / 40% 70% 60% 30%;
        transform: rotate(216deg) scale(1.05);
        opacity: 0.2;
    }
    80% {
        border-radius: 40% 70% 50% 30% / 70% 40% 50% 60%;
        transform: rotate(288deg) scale(0.98);
        opacity: 0.14;
    }
}

/* Texture Breathing */
@keyframes textureBreath {
    0%, 100% {
        opacity: 0.03;
        transform: scale(1);
    }
    50% {
        opacity: 0.08;
        transform: scale(1.02);
    }
}

/* Content Reveal Animations */
@keyframes revealContent {
    from {
        opacity: 0;
        transform: translateY(25px) scale(0.98);
        filter: blur(1px);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
}

/* Hero Image Animation */
@keyframes heroImageFloat {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    33% {
        transform: translateY(-8px) rotate(1deg);
    }
    66% {
        transform: translateY(-4px) rotate(-1deg);
    }
}

/* Image Aura Effect */
@keyframes auraGlow {
    0%, 100% {
        transform: scale(1);
        opacity: 0.4;
        background: radial-gradient(circle, rgba(109, 126, 255, 0.15), rgba(39, 213, 252, 0.1), transparent);
    }
    50% {
        transform: scale(1.15);
        opacity: 0.7;
        background: radial-gradient(circle, rgba(39, 213, 252, 0.2), rgba(109, 126, 255, 0.15), transparent);
    }
}

/* Title Gradient Shift */
@keyframes titleShimmer {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

/* Enhanced CTA Button */
.cta-section {
    display: flex;
    justify-content: center;
    align-items: center;
}

.cta-button {
    position: relative;
    background: transparent;
    border: none;
    border-radius: 16px;
    padding: 16px 32px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    transform: translateY(0);
}

.cta-button:hover {
    transform: translateY(-3px);
}

.cta-button:active {
    transform: translateY(-1px);
    transition-duration: 0.1s;
}

.cta-content {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 2;
}

.cta-icon {
    width: 20px;
    height: 20px;
    color: #6d7eff;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotate(90deg);
}

.cta-button:hover .cta-icon {
    transform: rotate(90deg) scale(1.1);
    filter: drop-shadow(0 0 8px rgba(109, 126, 255, 0.6));
    color: #27d5fc;
}

.cta-text {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    background: linear-gradient(135deg, #6d7eff, #27d5fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: all 0.4s ease;
}

.cta-button:hover .cta-text {
    background: linear-gradient(135deg, #27d5fc, #6d7eff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.cta-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
}

.cta-button:hover .cta-glow {
    opacity: 0;
}

@keyframes ctaGlow {
    0%, 100% {
        transform: scale(1);
        opacity: 0.5;
    }
    50% {
        transform: scale(1.02);
        opacity: 0.8;
    }
}

/* Animation Canvas */
.animation-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
}

/* Named Floating Gradient Balls with Subtle Appearance */
.orb-azure-dream {
    background: radial-gradient(circle at 30% 30%, rgba(109, 126, 255, 0.15), rgba(39, 213, 252, 0.08), transparent);
    box-shadow: 0 0 60px rgba(109, 126, 255, 0.06);
}

.orb-cyan-whisper {
    background: radial-gradient(circle at 25% 40%, rgba(39, 213, 252, 0.18), rgba(109, 126, 255, 0.10), transparent);
    box-shadow: 0 0 55px rgba(39, 213, 252, 0.08);
}

.orb-violet-galaxy {
    background: radial-gradient(circle at 35% 25%, rgba(138, 43, 226, 0.12), rgba(109, 126, 255, 0.08), rgba(39, 213, 252, 0.04), transparent);
    box-shadow: 0 0 70px rgba(138, 43, 226, 0.05);
}

.orb-sapphire-mist {
    background: radial-gradient(circle at 40% 30%, rgba(0, 123, 255, 0.14), rgba(39, 213, 252, 0.07), transparent);
    box-shadow: 0 0 50px rgba(0, 123, 255, 0.06);
}

.orb-ocean-breeze {
    background: radial-gradient(circle at 20% 35%, rgba(0, 206, 209, 0.16), rgba(109, 126, 255, 0.09), transparent);
    box-shadow: 0 0 65px rgba(0, 206, 209, 0.07);
}

/* Subtle Floating Orbs */
.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(35px);
    animation: orbFloat ease-in-out infinite;
}

.orb-1 {
    width: 180px;
    height: 180px;
    top: 20%;
    left: 10%;
    animation: azureDreamFloat ease-in-out infinite;
    animation-duration: 16s;
    animation-delay: 0s;
}

.orb-2 {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 15%;
    animation: cyanWhisperFloat ease-in-out infinite;
    animation-duration: 20s;
    animation-delay: -5s;
}

.orb-3 {
    width: 220px;
    height: 220px;
    bottom: 25%;
    left: 70%;
    animation: violetGalaxyFloat ease-in-out infinite;
    animation-duration: 14s;
    animation-delay: -10s;
}

.orb-4 {
    width: 120px;
    height: 120px;
    top: 40%;
    left: 80%;
    animation: sapphireMistFloat ease-in-out infinite;
    animation-duration: 24s;
    animation-delay: -15s;
}

.orb-5 {
    width: 170px;
    height: 170px;
    bottom: 40%;
    left: 5%;
    animation: oceanBreezeFloat ease-in-out infinite;
    animation-duration: 18s;
    animation-delay: -8s;
}

/* Dynamic Gradient Shapes */
.gradient-shape {
    position: absolute;
    background: linear-gradient(45deg, rgba(109, 126, 255, 0.08), rgba(39, 213, 252, 0.05), rgba(255, 107, 107, 0.03));
    filter: blur(50px);
    animation: shapeShift ease-in-out infinite;
}

.shape-1 {
    width: 300px;
    height: 200px;
    top: 15%;
    right: 20%;
    animation-duration: 35s;
}

.shape-2 {
    width: 250px;
    height: 300px;
    bottom: 20%;
    left: 15%;
    animation-duration: 40s;
    animation-delay: -12s;
}

.shape-3 {
    width: 200px;
    height: 250px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-duration: 45s;
    animation-delay: -25s;
}

/* Background Texture */
.texture-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 20% 20%, rgba(109, 126, 255, 0.02) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(39, 213, 252, 0.02) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(255, 107, 107, 0.01) 0%, transparent 50%);
    animation: textureBreath ease-in-out infinite;
    animation-duration: 20s;
}

/* Content Styling */
.content-container {
    animation: revealContent 1.5s ease-out forwards;
}

.hero-image {
    animation: heroImageFloat 6s ease-in-out infinite;
    filter: drop-shadow(0 8px 25px rgba(109, 126, 255, 0.2));
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-wrapper {
    position: relative;
    display: inline-block;
}

.image-aura {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150px;
    height: 150px;
    border-radius: 50%;
    animation: auraGlow 8s ease-in-out infinite;
    z-index: -1;
    filter: blur(20px);
}

.hero-title {
    background: linear-gradient(135deg, #6d7eff, #27d5fc, #ff6b6b, #6d7eff);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: titleShimmer 8s ease-in-out infinite;
    text-shadow: none;
}

.description-text {
    transition: all 0.4s ease;
}

.reveal-1 {
    animation: revealContent 1s ease-out forwards;
    animation-delay: 0.3s;
    opacity: 0;
}

.reveal-2 {
    animation: revealContent 1s ease-out forwards;
    animation-delay: 0.6s;
    opacity: 0;
}

.reveal-3 {
    animation: revealContent 1s ease-out forwards;
    animation-delay: 0.9s;
    opacity: 0;
}

.cta-text {
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
    padding: 8px 12px;
}

.cta-text:hover {
    transform: translateY(-2px);
    color: #6d7eff;
    background: rgba(109, 126, 255, 0.05);
    animation: ctaPulse 2s ease-in-out infinite;
}

.cta-icon {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-text:hover .cta-icon {
    transform: rotate(90deg) scale(1.1);
    filter: drop-shadow(0 0 8px rgba(109, 126, 255, 0.4));
}

.text-content {
    position: relative;
}

/* Enhanced positioning */
h1, p, h3 {
    position: relative;
    z-index: 15;
}

/* Responsive Design */
@media (max-width: 768px) {
    .orb {
        filter: blur(20px);
        opacity: 0.7;
    }
    
    .gradient-shape {
        filter: blur(35px);
    }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
    .cta-button {
        background: transparent;
        border: none;
    }
    
    .cta-button:hover {
        background: transparent;
    }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    .orb,
    .gradient-shape,
    .texture-overlay,
    .hero-image,
    .image-aura {
        animation: none;
    }
    
    .hero-title {
        animation: none;
        background: linear-gradient(135deg, #6d7eff, #27d5fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}

/* Performance Optimizations */
.orb,
.gradient-shape {
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform-style: preserve-3d;
}
</style>