<template>
    <div class="flex h-full">
        <!-- Sidebar Navigation -->
        <div class="w-80 border-r border-[#e0e6ed] dark:border-[#1b2e4b]">
            <div class="p-6 space-y-6">
                <div>
                    <h2 class="text-xl font-semibold dark:text-white-light">Applicant Scoring Tools</h2>
                    <p class="text-sm text-white-dark mt-1">Evaluate College Applicants with Intelligence and Fairness
                    </p>
                </div>

                <!-- Navigation Menu -->
                <div class="space-y-2">
                    <div class="nav-item" :class="{ 'active': currentPage === 'document-verification' }"
                        @click="navigateTo('document-verification')">
                        <div class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200"
                            :class="{
                                'bg-primary text-white': currentPage === 'document-verification',
                                'text-white-dark hover:bg-[#f1f2f3] dark:hover:bg-[#1b2e4b] hover:text-primary': currentPage !== 'document-verification'
                            }">
                            <div class="w-2 h-2 rounded-full" :class="{
                                'bg-white': currentPage === 'document-verification',
                                'bg-white-dark': currentPage !== 'document-verification'
                            }"></div>
                            <span class="font-medium">Upload & Verify Documents</span>
                        </div>
                    </div>

                    <div class="nav-item" :class="{ 'active': currentPage === 'candidate-scoring' }"
                        @click="navigateTo('candidate-scoring')">
                        <div class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200"
                            :class="{
                                'bg-primary text-white': currentPage === 'candidate-scoring',
                                'text-white-dark hover:bg-[#f1f2f3] dark:hover:bg-[#1b2e4b] hover:text-primary': currentPage !== 'candidate-scoring'
                            }">
                            <div class="w-2 h-2 rounded-full" :class="{
                                'bg-white': currentPage === 'candidate-scoring',
                                'bg-white-dark': currentPage !== 'candidate-scoring'
                            }"></div>
                            <span class="font-medium">Candidate Scoring</span>
                        </div>
                    </div>

                    <div class="nav-item" :class="{ 'active': currentPage === 'program-rankings' }"
                        @click="navigateTo('program-rankings')">
                        <div class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200"
                            :class="{
                                'bg-primary text-white': currentPage === 'program-rankings',
                                'text-white-dark hover:bg-[#f1f2f3] dark:hover:bg-[#1b2e4b] hover:text-primary': currentPage !== 'program-rankings'
                            }">
                            <div class="w-2 h-2 rounded-full" :class="{
                                'bg-white': currentPage === 'program-rankings',
                                'bg-white-dark': currentPage !== 'program-rankings'
                            }"></div>
                            <span class="font-medium">Program Rankings</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Area -->


        <div class="flex-1 p-6 overflow-auto">
            <div v-if="currentPage === 'default'" class="flex items-center justify-center h-full">
                <div class="panel">
                    <div class="text-center py-8">
                        <div
                            class="flex-1 overflow-y-auto bg-white flex flex-col items-center justify-center text-center text-gray-600 text-3xl p-5">
                            <img src="/assets/images/Ai Agent_UTP applicant scoring.png" alt="Placeholder Image"
                                width=160 height="160" class="mb-4">
                        </div>
                        <h3 class="text-lg font-semibold mb-2 dark:text-white-light">Applicant Scoring</h3>
                        <p class="text-left text-white-dark mb-4 leading-relaxed">
                            The Applicant Scoring tool uses AI to streamline college admissions by rating applicants
                            based on their qualifications. It automates profile analysis, ensuring consistent and
                            unbiased evaluations, reduces administrative workload, allowing institutions to assess applications fairly
                            and efficiently. Leading to more confident, data-driven decisions.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Document Verification Page -->
            <DocumentVerification v-if="currentPage === 'document-verification'" />

            <!-- Candidate Scoring Page -->
            <CandidateScoring v-if="currentPage === 'candidate-scoring'" />

            <!-- Program Rankings Page -->
            <ProgramRankings v-if="currentPage === 'program-rankings'" />
        </div>
    </div>
</template>

<script>
import DocumentVerification from './DocumentVerification.vue'
import CandidateScoring from './CandidateScoring.vue'
import ProgramRankings from './ProgramRankings.vue'
export default {
    components: {
        DocumentVerification,
        CandidateScoring,
        ProgramRankings
    },
    data () {
        return {
            currentPage: 'default',
            mobileMenuOpen: false,
            isMobile: false
        }
    },
    mounted () {
        this.checkMobile()
        window.addEventListener('resize', this.checkMobile)

        // Reset scroll positions when component is mounted
        this.resetScrollPositions()
    },
    beforeUnmount () {
        window.removeEventListener('resize', this.checkMobile)
    },
    methods: {
        checkMobile () {
            this.isMobile = window.innerWidth < 768
            if (!this.isMobile) {
                this.mobileMenuOpen = false
            }
        },
        toggleMenu () {
            this.mobileMenuOpen = !this.mobileMenuOpen
        },
        navigateTo (page) {
            this.currentPage = page
            // Close menu on mobile after navigation
            if (this.isMobile) {
                this.mobileMenuOpen = false
            }

            // Reset scroll positions when navigating between pages
            this.$nextTick(() => {
                this.resetScrollPositions()
            })
        },
        getCurrentPageTitle () {
            switch (this.currentPage) {
                case 'document-verification':
                    return 'Upload & Verify Documents'
                case 'candidate-scoring':
                    return 'Candidate Scoring'
                case 'program-rankings':
                    return 'Program Rankings'
                default:
                    return ''
            }
        },
        resetScrollPositions () {
            // Reset scroll position for the content area
            const contentElement = this.$el.querySelector('.flex-1')
            if (contentElement) {
                contentElement.scrollTop = 0
            }

            // Reset scroll positions for any scrollable elements within the component
            const scrollableElements = this.$el.querySelectorAll('*')
            scrollableElements.forEach(element => {
                if (element.scrollHeight > element.clientHeight ||
                    element.scrollWidth > element.clientWidth) {
                    element.scrollTop = 0
                    element.scrollLeft = 0
                }
            })
        }
    }
}
</script>

<style scoped>
/* Custom styles for responsive design */
@media (max-width: 768px) {
    .w-80 {
        width: 100%;
    }

    .flex {
        flex-direction: column;
    }
}

/* Navigation item hover effects */
.nav-item {
    transition: all 0.2s ease;
}

/* Focus states for accessibility */
.nav-item:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}
</style>
