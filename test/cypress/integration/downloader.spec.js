/// <reference types='Cypress' />

context('Asserting form', () => {
  before(() => {
    cy.visit('/downloader')
  })

  describe('form is responding accordingly', () => {
    it('{enter} on each input goes to next', () => {
      cy.get('input[name="name-input"]')
        .type('{enter}')

      cy.focused()
        .should('have.attr', 'name', 'from-ep-input')
        .and('have.value', '')
        .type('{enter}')

      cy.focused()
        .should('have.attr', 'name', 'until-ep-input')
        .and('have.value', '')
    })

    it('{backspace} on each input goes to previous when empty', () => {
      cy.get('input[name="until-ep-input"]')
        .should('have.value', '')
        .type('blabla')
        .should('have.value', '')
        .type('9')
        .type('{backspace}')

      cy.focused()
        .should('have.attr', 'name', 'until-ep-input')
        .type('{backspace}')

      cy.focused()
        .should('have.attr', 'name', 'from-ep-input')
        .and('have.value', '')
        .type('blabla')
        .should('have.value', '')
        .type('9')
        .type('{backspace}')

      cy.focused()
        .should('have.attr', 'name', 'from-ep-input')
        .type('{backspace}{backspace}')

      cy.focused()
        .should('have.attr', 'name', 'name-input')
        .and('have.value', '')
    })
  })
})
