import faker from 'faker';

Cypress.Commands.add('fillAddCompanyForm', () => {
  cy.writeFile('cypress/fixtures/add-company.json', {
    name: faker.company.companyName(),
    contact: faker.phone.phoneNumberFormat(),
    addresses: [
      {
        country: 'United States',
        state: 'Alabama',
        city: faker.address.city(),
        street: faker.address.streetName(),
        postalCode: faker.address.zipCode(),
      },
    ],
    employees: [
      {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        officePhone: faker.phone.phoneNumberFormat(),
        email: faker.internet.email(),
      },
    ],
  });

  cy.readFile('cypress/fixtures/add-company.json').then((company) => {
    cy.get("[data-cy='companyName']").clear().type(company.name);
    cy.get("[data-cy='companyContact']").clear().type(company.contact);
    cy.get("[data-cy='companyCountry']")
      .click()
      .wait(100)
      .get('.ant-select-dropdown-menu-item')
      .click()
      .wait(100);
    cy.get("[data-cy='companyState']")
      .click()
      .wait(100)
      .get('.ant-select-dropdown-menu > :nth-child(1)')
      .click()
      .wait(100);
    cy.get("[data-cy='companyCity']").clear().type(company.addresses[0].city);
    cy.get("[data-cy='companyStreet']")
      .clear()
      .type(company.addresses[0].street);
    cy.get("[data-cy='companyPostalCode']")
      .clear()
      .type(company.addresses[0].postalCode);

    cy.get("[data-cy='addCompanyFormNextButton']").click();

    cy.get("[data-cy='companyEmployeeFirstName']")
      .clear()
      .type(company.employees[0].firstName);
    cy.get("[data-cy='companyEmployeeLastName']")
      .clear()
      .type(company.employees[0].lastName);
    cy.get("[data-cy='companyEmployeeOfficePhone']")
      .clear()
      .type(company.employees[0].officePhone);
    cy.get("[data-cy='companyEmployeeHomePhone']").clear();
    cy.get("[data-cy='companyEmployeeEmail']")
      .clear()
      .type(company.employees[0].email);

    cy.get("[data-cy='addCompanyFormSubmitButton']").click();
  });
});
