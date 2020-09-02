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

  it('Navigate to the company add page ', function () {
    cy.url().should('have.string', '/companies');
    cy.get("[data-cy='single-table-action-button']")
      .click()
      .wait(2000)
      .url()
      .should('have.string', '/companies/add');
  });

  it('Should show right validation error messages', function () {
    // company name error
    cy.checkError("[data-cy='companyName']", '', 'Enter a company name');

    // company phone number error
    cy.checkError(
      "[data-cy='companyContact']",
      '',
      'Enter a valid phone number'
    );

    cy.checkError(
      "[data-cy='companyContact']",
      'invalid',
      'Enter a valid phone number'
    );

    // company city error
    cy.checkError("[data-cy='companyCity']", '', 'Enter a valid city');

    cy.checkError("[data-cy='companyCity']", '12', 'Enter a valid city');

    // company zipcode error
    cy.checkError("[data-cy='companyPostalCode']", '', 'Enter a valid zipcode');

    cy.checkError(
      "[data-cy='companyPostalCode']",
      'ss',
      'Enter a valid zipcode'
    );

    // going on next tab
    cy.get("[data-cy='addCompanyFormNextButton']").click();

    // company admin first name error
    cy.checkError(
      "[data-cy='companyEmployeeFirstName']",
      '',
      'Enter a valid first name'
    );

    cy.checkError(
      "[data-cy='companyEmployeeFirstName']",
      '12',
      'Enter a valid first name'
    );

    // company admin last name error
    cy.checkError(
      "[data-cy='companyEmployeeLastName']",
      '',
      'Enter a valid last name'
    );

    cy.checkError(
      "[data-cy='companyEmployeeLastName']",
      '12',
      'Enter a valid last name'
    );

    // company admin office phone number error
    cy.checkError(
      "[data-cy='companyEmployeeOfficePhone']",
      '',
      'Enter a valid phone number'
    );

    cy.checkError(
      "[data-cy='companyEmployeeOfficePhone']",
      'invalid',
      'Enter a valid phone number'
    );

    // company admin home phone number error
    cy.checkError(
      "[data-cy='companyEmployeeHomePhone']",
      'invalid',
      'Enter a valid phone number'
    );

    // company admin home and office phone same error
    cy.getItem("[data-cy='companyEmployeeHomePhone']")
      .clear()
      .type('1111111111');
    cy.getItem("[data-cy='companyEmployeeOfficePhone']")
      .clear()
      .type('1111111111');
    cy.contains('Home phone cannot be same as office phone');

    // company admin email error
    cy.checkError(
      "[data-cy='companyEmployeeEmail']",
      '',
      'Enter a valid email'
    );

    cy.checkError(
      "[data-cy='companyEmployeeEmail']",
      '12d',
      'Enter a valid email'
    );

    // going to the previous tab
    cy.get("[data-cy='addCompanyFormPreviousButton']").click();
  });

  it('User can upload image successfully', function () {
    const imagePath = data.image_path;
    cy.wait(1500);
    cy.get("[data-cy='file-upload']").attachFile(
      imagePath,
      {
        subjectType: 'drag-n-drop',
      },
      { force: true }
    );
    cy.wait(40000);
  });

  it('User should be able to add a company', function () {
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
  });
});
