describe('Sidebar Component', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForVueApp()
  })

  describe('Sidebar Structure and Visibility', () => {
    it('should render the sidebar with correct structure', () => {
      cy.get('.sidebar').should('exist').and('be.visible')
      cy.get('.sidebar').should('have.class', 'fixed')
      cy.get('.sidebar').should('have.class', 'min-h-screen')
      cy.get('.sidebar').should('have.css', 'width', '260px')
    })

    it('should display the main logo and brand name', () => {
      cy.get('.main-logo img').should('exist').and('be.visible')
      cy.get('.main-logo img').should('have.attr', 'src', '/assets/images/logo.png')
      cy.get('.main-logo span').should('contain.text', 'AI AGENT')
    })

    it('should have collapse icon button', () => {
      cy.get('.collapse-icon').should('exist').and('be.visible')
      cy.get('.collapse-icon svg').should('exist')
    })
  })

  describe('Sidebar Navigation Structure', () => {
    it('should display CHATBOT section header', () => {
      cy.get('h2').contains('CHATBOT').should('exist').and('be.visible')
    })

    it('should display WORKFLOW section header', () => {
      cy.get('h2').contains('WORKFLOW').should('exist').and('be.visible')
    })

    it('should have all chatbot navigation items', () => {
      const chatbotItems = [
        { text: 'PB Customer Support', href: '/chatbot/customer-support' },
        { text: 'Program Advisor', href: '/chatbot/program-advisor' },
        { text: 'Pet Sitter Trainer', href: '/chatbot/pet-trainer' },
        { text: 'Mortgage Assistant', href: '/chatbot/mortgage-assistant' }
      ]

      chatbotItems.forEach(item => {
        cy.get(`a[href="${item.href}"]`).should('exist')
        cy.get(`a[href="${item.href}"] span`).should('contain.text', item.text)
      })
    })
    it('should have all workflow navigation items', () => {
      const workflowItems = [
        { text: 'Applicant Scoring', href: '/workflow/applicant-scoring' },
        { text: 'PB Issue Classification', href: '/workflow/issue-classification' },
        { text: 'Purchase Order Extraction', href: '/workflow/purchase-order' },
        { text: 'Data Cleansing', href: '/workflow/data-cleansing' },
        { text: 'Receipt Claim Analyzer', href: '/workflow/receipt-claim' }
      ]

      workflowItems.forEach(item => {
        cy.get(`a[href="${item.href}"]`).should('exist')
        cy.get(`a[href="${item.href}"] span`).should('contain.text', item.text)
      })
    })
  })

  describe('Sidebar Functionality', () => {
    it('should toggle sidebar when collapse icon is clicked', () => {
      cy.get('.collapse-icon').click()
      cy.wait(500)
    })

    it('should highlight active navigation item', () => {
      cy.visit('/chatbot/customer-support')
      cy.waitForVueApp()
      cy.get('a[href="/chatbot/customer-support"]').should('have.class', 'active')
    })
  })

  describe('Sidebar Navigation Interactions', () => {
    it('should navigate to PB Customer Support when clicked', () => {
      cy.get('a[href="/chatbot/customer-support"]').click()
      cy.url().should('include', '/chatbot/customer-support')
    })

    it('should navigate to Program Advisor when clicked', () => {
      cy.get('a[href="/chatbot/program-advisor"]').click()
      cy.url().should('include', '/chatbot/program-advisor')
    })

    it('should navigate to Pet Sitter Trainer when clicked', () => {
      cy.get('a[href="/chatbot/pet-trainer"]').click()
      cy.url().should('include', '/chatbot/pet-trainer')
    })

    it('should navigate to Mortgage Assistant when clicked', () => {
      cy.get('a[href="/chatbot/mortgage-assistant"]').click()
      cy.url().should('include', '/chatbot/mortgage-assistant')
    })

    it('should navigate to Applicant Scoring when clicked', () => {
      cy.get('a[href="/workflow/applicant-scoring"]').click()
      cy.url().should('include', '/workflow/applicant-scoring')
    })
  })
  describe('More Navigation Tests', () => {
    it('should navigate to remaining workflow items', () => {
      cy.get('a[href="/workflow/issue-classification"]').click()
      cy.url().should('include', '/workflow/issue-classification')
      
      cy.get('a[href="/workflow/purchase-order"]').click()
      cy.url().should('include', '/workflow/purchase-order')
      
      cy.get('a[href="/workflow/data-cleansing"]').click()
      cy.url().should('include', '/workflow/data-cleansing')
      
      cy.get('a[href="/workflow/receipt-claim"]').click()
      cy.url().should('include', '/workflow/receipt-claim')
    })
  })

  describe('Sidebar Icons and Effects', () => {
    it('should display icons for all navigation items', () => {
      cy.get('a[href="/chatbot/customer-support"] svg').should('exist')
      cy.get('a[href="/chatbot/program-advisor"] svg').should('exist')
      cy.get('a[href="/chatbot/pet-trainer"] svg').should('exist')
      cy.get('a[href="/chatbot/mortgage-assistant"] svg').should('exist')
      cy.get('a[href="/workflow/applicant-scoring"] svg').should('exist')
    })

    it('should show hover effects on navigation items', () => {
      cy.get('a[href="/chatbot/customer-support"]').trigger('mouseover')
      cy.get('.collapse-icon').trigger('mouseover')
    })
  })

  describe('Responsive and Accessibility', () => {
    it('should handle mobile viewport correctly', () => {
      cy.viewport(375, 667)
      cy.get('.sidebar').should('exist')
    })

    it('should have perfect scrollbar container', () => {
      cy.get('.sidebar .ps').should('exist')
    })

    it('should navigate to home when logo is clicked', () => {
      cy.visit('/chatbot/customer-support')
      cy.waitForVueApp()
      cy.get('.main-logo').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })
})
