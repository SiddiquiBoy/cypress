///<reference types="Cypress"/>
const data = require('../../../fixtures/data.json');
const { TitleCasePipe } = require('@angular/common');

describe('', function () {
  before(function () {
    cy.login(data.base_url, data.superAdmin_username, data.superAdmin_password);
  });

  after(function () {
    cy.logout();
  });

  it('Navigate to the company list page ', function () {
    cy.url().should('have.string', '/companies');
  });

  it('Should search on the table data', function () {
    cy.fixture('edit-company').then((company) => {
      if (company) {
        // search by name
        cy.get("[data-cy='app-searchbar']").clear().type(company.name);
        cy.wait(2000);
        cy.get('table > tbody > tr:nth-child(1) >td:nth-child(1)').should(
          'contain.text',
          new TitleCasePipe().transform(company.name)
        );

        // search by street
        cy.get("[data-cy='app-searchbar']")
          .clear()
          .type(company.addresses[0].street);
        cy.wait(2000);
        cy.get('table > tbody > tr:nth-child(1) >td:nth-child(3)').should(
          'contain.text',
          new TitleCasePipe().transform(company.addresses[0].street)
        );
      } else {
        // do nothing
      }
    });
  });
});
