// Custom commands for Cypress tests

// Command to wait for Vue app to be ready
Cypress.Commands.add('waitForVueApp', () => {
  cy.window().should('have.property', 'Vue')
  cy.get('[data-v-app]', { timeout: 10000 }).should('exist')
})

// Command to toggle sidebar
Cypress.Commands.add('toggleSidebar', () => {
  cy.get('.collapse-icon').click()
})

// Command to navigate to specific route via sidebar
Cypress.Commands.add('navigateViaSidebar', (routePath: string) => {
  cy.get(`.sidebar a[href="${routePath}"]`).click()
})

// Command to check if sidebar is collapsed
Cypress.Commands.add('checkSidebarCollapsed', () => {
  cy.get('.sidebar').should('have.class', 'collapsed')
})

// Command to check if sidebar is expanded
Cypress.Commands.add('checkSidebarExpanded', () => {
  cy.get('.sidebar').should('not.have.class', 'collapsed')
})

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      waitForVueApp(): Chainable<void>
      toggleSidebar(): Chainable<void>
      navigateViaSidebar(routePath: string): Chainable<void>
      checkSidebarCollapsed(): Chainable<void>
      checkSidebarExpanded(): Chainable<void>
    }
  }
}

export {}

