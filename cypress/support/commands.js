Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    cy.get('#firstName').type('Winicius')
    cy.get('#lastName').type('Andrade')
    cy.get('#email').type('test@test.com')
    cy.get('#open-text-area').type('Teste')

    cy.contains('.button', 'Enviar').click()
})