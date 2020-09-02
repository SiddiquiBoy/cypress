///<reference types="Cypress"/>
import 'cypress-file-upload';
import { TitleCasePipe } from '@angular/common';

const data = require('../../../fixtures/data.json');

describe('', function () {
  before(function () {
    cy.login(data.base_url, data.superAdmin_username, data.superAdmin_password);
  });

  after(function () {
    cy.logout();
  });

  it('Navigate to the company edit page ', function () {
    cy.url().should('have.string', '/companies');
    cy.get("[data-cy='editButton']")
      .eq(0)
      .click()
      .wait(2000)
      .url()
      .should('have.string', '/companies')
      .should('have.string', '/edit');
  });

  it('User should be able to edit a company', function () {
    // navigate to company list page
    cy.get("[data-cy='addCompanyFormCancelLink']").click().wait(2000);
    cy.url().should('have.string', '/companies');

    // navigate to add company page
    cy.get("[data-cy='single-table-action-button']")
      .click()
      .wait(2000)
      .url()
      .should('have.string', '/companies/add');

    // adding a company
    cy.fillAddCompanyForm();
    cy.wait(4000);
    cy.url().should('have.string', '/companies');

    // checking if the company is added or not
    cy.fixture('add-company').then((company) => {
      cy.get("[data-cy='app-searchbar']").clear().type(company.name);
      cy.wait(2000);
      cy.get('table > tbody > tr:nth-child(1) >td:nth-child(1)').should(
        'contain.text',
        new TitleCasePipe().transform(company.name)
      );
    });

    // clickiing on edit of the company just added
    cy.get("[data-cy='editButton']")
      .eq(0)
      .click()
      .wait(2000)
      .url()
      .should('have.string', '/companies')
      .should('have.string', '/edit');

    // editing a company
    cy.fillEditCompanyForm(2, 2);
    cy.wait(4000);
    cy.url().should('have.string', '/companies');

    // checking if the company is edited or not
    cy.fixture('edit-company').then((company) => {
      cy.get("[data-cy='app-searchbar']").clear().type(company.name);
      cy.wait(2000);
      cy.get('table > tbody > tr:nth-child(1) >td:nth-child(1)').should(
        'contain.text',
        new TitleCasePipe().transform(company.name)
      );
    });

    // clickiing on edit of the company just edited
    cy.get("[data-cy='editButton']")
      .eq(0)
      .click()
      .wait(2000)
      .url()
      .should('have.string', '/companies')
      .should('have.string', '/edit');

    // resetting the status to active
    cy.fillEditCompanyForm(1, 1);
    cy.wait(4000);
    cy.url().should('have.string', '/companies');
  });
});
