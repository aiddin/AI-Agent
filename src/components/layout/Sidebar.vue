<template>
    <div :class="{ 'dark text-white-dark': store.semidark }">
        <nav
            class="sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300">
            <div class="bg-white dark:bg-[#0e1726] h-full">
                <div class="flex justify-between items-center px-4 py-3">
                    <router-link to="/" class="main-logo flex items-center shrink-0" @click="toggleMobileMenu">
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
                }" class="h-[calc(100vh-80px)] relative">
                    <ul class="relative font-semibold space-y-0.5 p-4 py-0">

                        <h2
                            class="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                     <svg class="group-hover:!text-primary shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
                            <span>CHATBOT</span>
                        </h2>

                        <li class="nav-item">
                            <ul>
                                <li class="nav-item">
                                    <router-link to="/chatbot/customer-support" class="group"
                                        @click="toggleMobileMenu('chatbot1')">
                                        <div class="flex items-center">
                                            <icon-menu-chat class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                PB Customer Support
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/chatbot/program-advisor" class="group"
                                        @click="toggleMobileMenu('chatbot2')">
                                        <div class="flex items-center">
                                            <IconMenuScrumboard class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Program Advisor
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/chatbot/pet-trainer" class="group"
                                        @click="toggleMobileMenu('chatbot3')">
                                        <div class="flex items-center">
                                            <IconMenuDocumentation class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Pet Sitter Trainer
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/chatbot/mortgage-assistant" class="group"
                                        @click="toggleMobileMenu('chatbot4')">
                                        <div class="flex items-center">
                                            <icon-menu-invoice class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Mortgage Assistant
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/chatbot/mortgage-documents" class="group"
                                        @click="toggleMobileMenu('chatbot5')">
                                        <div class="flex items-center">
                                            <icon-menu-forms class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Mortgage Documents
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                            </ul>
                        </li>

                        <h2
                            class="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                    <svg class="group-hover:!text-primary shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg><span>WORKFLOW</span>
                        </h2>
                        <li class="nav-item">
                            <ul>
                                <li class="nav-item">
                                    <router-link to="/workflow/applicant-scoring" class="group"
                                        @click="toggleMobileMenu">
                                        <div class="flex items-center">
                                            <icon-menu-users class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Applicant Scoring
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/workflow/issue-classification" class="group"
                                        @click="toggleMobileMenu">
                                        <div class="flex items-center">
                                            <icon-menu-components class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                PB Issue Classification
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/workflow/purchase-order" class="group" @click="toggleMobileMenu">
                                        <div class="flex items-center">
                                            <icon-menu-invoice class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Purchase Order Extraction
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/workflow/data-cleansing" class="group" @click="toggleMobileMenu">
                                        <div class="flex items-center">
                                            <icon-menu-datatables class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Data Cleansing
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/workflow/receipt-claim" class="group" @click="toggleMobileMenu">
                                        <div class="flex items-center">
                                            <icon-menu-forms class="group-hover:!text-primary shrink-0" />
                                            <span
                                                class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                Receipt Claim Analyzer
                                            </span>
                                        </div>
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </perfect-scrollbar>
            </div>
        </nav>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/index'
import VueCollapsible from 'vue-height-collapsible/vue3'
import IconCaretsDown from '@/components/icon/icon-carets-down.vue'
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard.vue'
import IconMinus from '@/components/icon/icon-minus.vue'
import IconCpuBolt from '@/components/icon/icon-cpu-bolt.vue'
import IconMenuChat from '@/components/icon/menu/icon-menu-chat.vue'
import IconMenuMailbox from '@/components/icon/menu/icon-menu-mailbox.vue'
import IconMenuTodo from '@/components/icon/menu/icon-menu-todo.vue'
import IconMenuNotes from '@/components/icon/menu/icon-menu-notes.vue'
import IconMenuScrumboard from '@/components/icon/menu/icon-menu-scrumboard.vue'
import IconMenuContacts from '@/components/icon/menu/icon-menu-contacts.vue'
import IconMenuInvoice from '@/components/icon/menu/icon-menu-invoice.vue'
import IconCaretDown from '@/components/icon/icon-caret-down.vue'
import IconMenuCalendar from '@/components/icon/menu/icon-menu-calendar.vue'
import IconMenuComponents from '@/components/icon/menu/icon-menu-components.vue'
import IconMenuElements from '@/components/icon/menu/icon-menu-elements.vue'
import IconMenuCharts from '@/components/icon/menu/icon-menu-charts.vue'
import IconMenuWidgets from '@/components/icon/menu/icon-menu-widgets.vue'
import IconMenuFontIcons from '@/components/icon/menu/icon-menu-font-icons.vue'
import IconMenuDragAndDrop from '@/components/icon/menu/icon-menu-drag-and-drop.vue'
import IconMenuTables from '@/components/icon/menu/icon-menu-tables.vue'
import IconMenuDatatables from '@/components/icon/menu/icon-menu-datatables.vue'
import IconMenuForms from '@/components/icon/menu/icon-menu-forms.vue'
import IconMenuUsers from '@/components/icon/menu/icon-menu-users.vue'
import IconMenuPages from '@/components/icon/menu/icon-menu-pages.vue'
import IconMenuAuthentication from '@/components/icon/menu/icon-menu-authentication.vue'
import IconMenuDocumentation from '@/components/icon/menu/icon-menu-documentation.vue'

const store = useAppStore()
const activeDropdown: any = ref('')
const subActive: any = ref('')
const currentChatbot: any = ref('')
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

const toggleMobileMenu = (chatbot) => {
    if (!chatbot || chatbot !== currentChatbot.value) {
        currentChatbot.value = chatbot

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
