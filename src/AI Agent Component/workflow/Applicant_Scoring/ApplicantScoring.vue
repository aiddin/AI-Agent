<template>
  <div class="applicant-scoring">
    <!-- Navigation header for mobile -->
    <div class="nav-header" v-if="isMobile">
      <div class="current-page-title">{{ getCurrentPageTitle() }}</div>
      <div class="menu-toggle" @click="toggleMenu">
        <span>Menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>

    <!-- Navigation sidebar - always visible on desktop, dropdown on mobile -->
    <div class="sidebar" :class="{ 'mobile-view': isMobile, 'mobile-open': mobileMenuOpen }">
      <h2 v-if="!isMobile">Tools</h2>
      <div 
        class="nav-item" 
        :class="{ active: currentPage === 'document-verification' }"
        @click="navigateTo('document-verification')"
      >
        Upload & Verify Documents
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentPage === 'candidate-scoring' }"
        @click="navigateTo('candidate-scoring')"
      >
        Candidate Scoring
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentPage === 'program-rankings' }"
        @click="navigateTo('program-rankings')"
      >
        Program Rankings
      </div>
    </div>

    <!-- Main content area -->
    <div class="content">
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
  data() {
    return {
      currentPage: 'document-verification',
      mobileMenuOpen: false,
      isMobile: false
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    
    // Reset scroll positions when component is mounted
    this.resetScrollPositions();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 768;
      if (!this.isMobile) {
        this.mobileMenuOpen = false;
      }
    },
    toggleMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    navigateTo(page) {
      this.currentPage = page;
      // Close menu on mobile after navigation
      if (this.isMobile) {
        this.mobileMenuOpen = false;
      }
      
      // Reset scroll positions when navigating between pages
      this.$nextTick(() => {
        this.resetScrollPositions();
      });
    },
    getCurrentPageTitle() {
      switch(this.currentPage) {
        case 'document-verification':
          return 'Upload & Verify Documents';
        case 'candidate-scoring':
          return 'Candidate Scoring';
        case 'program-rankings':
          return 'Program Rankings';
        default:
          return 'Applicant Scoring';
      }
    },
    resetScrollPositions() {
      // Reset scroll position for the content area
      const contentElement = this.$el.querySelector('.content');
      if (contentElement) {
        contentElement.scrollTop = 0;
      }
      
      // Reset scroll positions for any scrollable elements within the component
      const scrollableElements = this.$el.querySelectorAll('*');
      scrollableElements.forEach(element => {
        if (element.scrollHeight > element.clientHeight || 
            element.scrollWidth > element.clientWidth) {
          element.scrollTop = 0;
          element.scrollLeft = 0;
        }
      });
    }
  }
}
</script>

<style scoped>
.applicant-scoring {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #1a1a1a;
  overflow: hidden;
  position: relative;
  font-family: 'Inter', sans-serif;
}

/* Navigation header for mobile */
.nav-header {
  margin-top: 3vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2a2a2a;
  color: white;
  padding: 15px 20px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #3a3a3a;
}

.current-page-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #ffffff;
}

/* Menu toggle for mobile */
.menu-toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 15px;
  background-color: #4a4a4a;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: 1px solid #666;
  color: #ffffff;
}

.menu-toggle:hover {
  background-color: #555;
}

.menu-toggle span {
  margin-right: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.menu-toggle svg {
  transition: transform 0.3s ease;
}

.menu-toggle:hover svg {
  transform: rotate(180deg);
}

/* Sidebar styles */
.sidebar {
  width: 200px;
  background-color: #2a2a2a;
  padding: 20px 0;
  color: white;
  transition: all 0.3s ease;
  border-right: 1px solid #3a3a3a;
  position: relative;
}

.sidebar h2 {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 15px;
  color: #888;
  padding: 0 20px;
}

.nav-item {
  padding: 12px 20px;
  margin: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #ccc;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: #3a3a3a;
  color: #fff;
}

.nav-item.active {
  background-color: #3a3a3a;
  color: #fff;
  border-left: 3px solid #dc3545;
}

.content {
  flex: 1;
  overflow-y: auto;
  background-color: #1a1a1a;
  position: relative;
}

/* Custom scrollbar */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: #3a3a3a;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* Mobile styles */
@media (max-width: 768px) {
  .applicant-scoring {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 0;
    margin-bottom: 15px;
    max-height: 0;
    overflow: hidden;
    border-right: none;
  }
  
  .sidebar.mobile-view {
    background: transparent;
    position: relative;
  }
  
  .sidebar.mobile-open {
    max-height: 350px;
    padding: 20px;
    background-color: #2a2a2a;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideDown 0.3s ease-out;
  }
  
  .content {
    width: 100%;
    padding: 20px;
  }
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus states for accessibility */
.nav-item:focus {
  outline: 2px solid #dc3545;
  outline-offset: 2px;
}

.menu-toggle:focus {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}
</style>
