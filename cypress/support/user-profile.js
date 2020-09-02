import faker from 'faker';

Cypress.Commands.add('User_Profile_Form', () => {
  const fName = 'Pulkit';
  const lName = 'Bansal';
  const home_phone = faker.phone.phoneNumberFormat();
  const office_phone = faker.phone.phoneNumberFormat();
  const email = 'pulkit@crownstack.com';
  cy.get("[data-cy='userProfileFirstName']").clear().type(fName);
  cy.get("[data-cy='userProfileLastName']").clear().type(lName);
  cy.get("[data-cy='userProfileHomePhone']").clear().type(home_phone);
  cy.get("[data-cy='userProfileOfficePhone']").clear().type(office_phone);
  cy.get("[data-cy='userProfileEmail']").clear().type(email);
  cy.get("[data-cy='form-submit-button']").click();
});
