Cypress.Commands.add('login', (url, email, password) => {
  cy.visit(url + '/login');
  cy.get('#companyName').contains(' CompassPro ');
  cy.get('.login-form-button').should('not.be.enabled');
  cy.get('[placeholder=Email]').should('be.visible').type(email);
  cy.get('[placeholder=Password]').should('be.visible').type(password);
  cy.get('.ant-checkbox-input').uncheck();
  cy.get('.login-form-button').should('be.visible').click();
  cy.wait(3000);
});

Cypress.Commands.add('logout', () => {
  // cy.get(".header-profile-link").click();
  // cy.get(".custom-profile-menu > :nth-child(3)").should("be.visible").click();
  cy.get('#profile-icon').click({force:true});
  cy.wait(2000);
  cy.get('[data-cy=logout]').click({force:true});
  cy.url().should('equal', 'http://localhost:4200/login');
});

Cypress.Commands.add('checkError', (itemSelector, value, error) => {
  if (value) {
    cy.getItem(itemSelector).clear().type(value);
  } else {
    cy.getItem(itemSelector).type('abc').clear();
  }
  cy.contains(error);
});

Cypress.Commands.add('getItem', (itemSelector) => {
  cy.get(itemSelector);
});

Cypress.Commands.add('checkValue', (itemSelector, value) => {
  cy.getItem(itemSelector).should('have.value', value);
});
