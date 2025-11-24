<template>
    <div :class="{ 'dark text-white-dark': store.semidark }">
        <nav
            class="sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300">
            <div class="bg-white dark:bg-[#0e1726] h-full flex flex-col">
                <div class="flex justify-between items-center px-4 py-3">
                    <router-link to="/" class="main-logo flex items-center shrink-0" @click="toggleMobileMenu()">
                        <img class="w-8 ml-[5px] flex-none" src="/assets/images/logo.png" alt="" />
                        <span
                            class="text-2xl ltr:ml-7 rtl:font-semibold align-middle lg:inline dark:text-white-light flex-grow text-center">AI
                            AGENT</span>
                    </router-link>
                    <a href="javascript:;"
                        class="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180 hover:text-primary"
                        @click="store.toggleSidebar()">
                        <icon-carets-down class="m-auto rotate-90" />
                    </a>
                </div>
                <perfect-scrollbar :options="{
                    swipeEasing: true,
                    wheelPropagation: false,
                }" class="flex-1 relative">
                    <ul class="relative font-semibold space-y-0.5 p-4 py-0">
                        <!-- Loop through menu sections -->
                        <template v-for="section in menuConfig" :key="section.title">
                            <h2
                                class="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <!-- Layout icon -->
                                <svg v-if="section.icon === 'layout'" class="group-hover:!text-primary shrink-0"
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                                <!-- Activity icon -->
                                <svg v-else-if="section.icon === 'activity'" class="group-hover:!text-primary shrink-0"
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                                <span>{{ section.title }}</span>
                            </h2>

                            <li class="nav-item">
                                <ul>
                                    <li v-for="item in section.items" :key="item.route" class="nav-item">
                                        <router-link :to="item.route" class="group"
                                            @click="toggleMobileMenu(item.id)">
                                            <div class="flex items-center">
                                                <component :is="getIconComponent(item.icon)"
                                                    class="group-hover:!text-primary shrink-0" />
                                                <span
                                                    class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    {{ item.label }}
                                                </span>
                                            </div>
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </ul>
                </perfect-scrollbar>

                <!-- Logout Button at Bottom -->
                <div class="p-4 border-t border-[#e0e6ed] dark:border-[#1b2e4b]">
                    <button
                        @click="handleLogout"
                        class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-danger text-white hover:bg-danger/80 transition-colors font-semibold"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import { menuConfig } from './sidebar-config'
import IconCaretsDown from '@/components/icon/icon-carets-down.vue'
import IconMenuChat from '@/components/icon/menu/icon-menu-chat.vue'
import IconMenuScrumboard from '@/components/icon/menu/icon-menu-scrumboard.vue'
import IconMenuInvoice from '@/components/icon/menu/icon-menu-invoice.vue'
import IconMenuComponents from '@/components/icon/menu/icon-menu-components.vue'
import IconMenuDatatables from '@/components/icon/menu/icon-menu-datatables.vue'
import IconMenuForms from '@/components/icon/menu/icon-menu-forms.vue'
import IconMenuUsers from '@/components/icon/menu/icon-menu-users.vue'
import IconMenuDocumentation from '@/components/icon/menu/icon-menu-documentation.vue'

const store = useAppStore()
const router = useRouter()
const currentChatbot: any = ref('')

const handleLogout = () => {
    store.logout()
    router.push({ name: 'login' })
}

// Icon component mapping
const iconMap: Record<string, any> = {
    'chat': IconMenuChat,
    'scrumboard': IconMenuScrumboard,
    'documentation': IconMenuDocumentation,
    'invoice': IconMenuInvoice,
    'forms': IconMenuForms,
    'users': IconMenuUsers,
    'components': IconMenuComponents,
    'datatables': IconMenuDatatables
}

const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || iconMap['chat']
}

onMounted(() => {
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]')
    if (selector) {
        selector.classList.add('active')
        const ul: any = selector.closest('ul.sub-menu')
        if (ul) {
            let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || []
            if (ele.length) {
                ele = ele[0]
                setTimeout(() => {
                    ele.click()
                })
            }
        }
    }
})

const toggleMobileMenu = (chatbot?: string) => {
    if (!chatbot || chatbot !== currentChatbot.value) {
        currentChatbot.value = chatbot || ''

        const n8nChatElement = document.getElementById('n8n-chat')
        if (n8nChatElement) {
            n8nChatElement.remove()
        }
    }

    if (window.innerWidth < 1024) {
        store.toggleSidebar()
    }
}
</script>
