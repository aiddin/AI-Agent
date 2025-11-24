<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-[#0e1726] dark:via-[#1b2e4b] dark:to-[#0e1726]">
        <div class="w-full max-w-md p-8">
            <!-- Logo and Title -->
            <div class="text-center mb-8">
                <img src="/assets/images/logo.png" alt="Logo" class="w-20 h-20 mx-auto mb-4" />
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white-light mb-2">AI AGENT</h1>
                <p class="text-gray-600 dark:text-white-dark">Enter password to continue</p>
            </div>

            <!-- Login Card -->
            <div class="bg-white dark:bg-[#0e1726] rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-[#1b2e4b]">
                <form @submit.prevent="handleLogin">
                    <!-- Password Input -->
                    <div class="mb-6">
                        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-white-light mb-2">
                            Password
                        </label>
                        <div class="relative">
                            <input
                                id="password"
                                v-model="password"
                                :type="showPassword ? 'text' : 'password'"
                                class="form-input w-full pr-12"
                                placeholder="Enter password"
                                :disabled="isLoading"
                                autofocus
                            />
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white-dark"
                            >
                                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Error Message -->
                    <div v-if="errorMessage" class="mb-6 p-3 bg-danger-light rounded-lg border border-danger">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-danger flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-sm text-danger">{{ errorMessage }}</p>
                        </div>
                    </div>

                    <!-- Login Button -->
                    <button
                        type="submit"
                        class="btn btn-primary w-full"
                        :disabled="isLoading || !password"
                    >
                        <span v-if="isLoading" class="flex items-center justify-center gap-2">
                            <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Logging in...
                        </span>
                        <span v-else>Login</span>
                    </button>
                </form>
            </div>

            <!-- Footer -->
            <div class="text-center mt-6">
                <p class="text-sm text-gray-500 dark:text-white-dark">
                    Protected by password authentication
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/index'

const router = useRouter()
const store = useAppStore()

const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Hardcoded password - change this to your desired password
const CORRECT_PASSWORD = 'admin123'

const handleLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password.value === CORRECT_PASSWORD) {
        // Set authentication in store
        store.setAuthenticated(true)

        // Redirect to home page
        router.push('/')
    } else {
        errorMessage.value = 'Incorrect password. Please try again.'
        password.value = ''
    }

    isLoading.value = false
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bg-white,
.dark .dark\:bg-\[#0e1726\] {
    animation: fadeIn 0.3s ease-out;
}
</style>
