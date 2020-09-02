///<reference types="Cypress"/>

const data = require('../../fixtures/data.json');

describe('', function () {
  // adimn can login successfully
  before(function () {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password);
  });

  // admin can logout successfully
  after(function () {
    cy.logout();
  });

  // open change password popup
  it('Should open change password popup', function () {
    cy.get("[data-cy='profile-icon']")
      .click()
      .wait(1000)
      .get("[data-cy='changePassword']")
      .click();
  });

  // old password field validation
  it('Should show error when clearing password', function () {
    cy.getItem("[data-cy='oldPassword']")
      .type('12d')
      .checkError("[data-cy='oldPassword']", '', 'Enter old password');
  });

  // new password field validation
  it('Should show error for wrong new password', function () {
    cy.getItem("[data-cy='newPassword']")
      .type('12d')
      .checkError("[data-cy='newPassword']", '', 'Enter new password');

    cy.checkError(
      "[data-cy='newPassword']",
      '12d',
      'Password must contain at least 8 characters, must contain one lower case, one upper case, one digit and one special character'
    );
  });

  // confirm password field validation
  it('Should show error for wrong confirm password', function () {
    cy.getItem("[data-cy='confirmPassword']")
      .type('12d')
      .checkError("[data-cy='confirmPassword']", '', 'Enter confirm password');

    cy.checkError(
      "[data-cy='confirmPassword']",
      '12d',
      'Password must contain at least 8 characters, must contain one lower case, one upper case, one digit and one special character'
    );
  });

  // check if new and confirm password are same
  it('Should check if new and confirm password are same when valid password is entered in both', function () {
    cy.getItem("[data-cy='newPassword']").clear().type('Password@1991');
    cy.getItem("[data-cy='confirmPassword']").clear().type('Password@1991!');
    cy.contains('New password did not match with the confirmed password');
  });

  // it should change the password and then reset it
  it('Should change the password to Password@1123', function () {
    cy.getItem("[data-cy='oldPassword']").clear().type('Password');
    cy.getItem("[data-cy='newPassword']").clear().type('Password@123');
    cy.getItem("[data-cy='confirmPassword']").clear().type('Password@123');
    cy.getItem("[data-cy='change-password-form-update-button']").click();

    cy.wait(5000);

    cy.logout();

    cy.login(data.base_url, data.OrgAdmin_username, 'Password@123');
    cy.url().should('have.string', '/dashboard');
  });
});
