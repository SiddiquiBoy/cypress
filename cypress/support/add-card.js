import faker from 'faker';

Cypress.Commands.add('fillAddCardForm', () => {
  cy.writeFile('cypress/fixtures/add-card.json', {
    name: faker.name.findName(),
    cardNumber: '4242424242424242042512312345',
    expiry: '0425',
    cvc: '123',
    zipcode: '12345'
  });

  cy.readFile('cypress/fixtures/add-card.json').then((card) => {
    cy.get("[data-cy='userName']").clear().type(card.name);
    cy.get('.__PrivateStripeElement > iframe').type(card.cardNumber);

    

    cy.get("[data-cy='saveCard']").click();
  });
});
