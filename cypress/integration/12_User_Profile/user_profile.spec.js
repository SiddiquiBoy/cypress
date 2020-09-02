///<reference types="Cypress"/>

import 'cypress-file-upload';
const data = require('../../fixtures/data.json');

describe('', function () {
  // Adimn can Login successfully
  before(function () {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password);
  });

  // Admin can Logout successfully
  after(function () {
    cy.logout();
  });

  // Navigate to the User Profile Page
  it('Navigate to the User Profile Page ', function () {
    cy.get('#profile-icon').click();
    cy.get('#user-profile').click();
    cy.wait(2000);
  });

  // Error should be shown while entering wrong data

  // first name field validation
  it('Should show error when entering wrong first name', function () {
    cy.checkError(
      "[data-cy='userProfileFirstName']",
      '',
      'Enter valid first name'
    );

    cy.checkError(
      "[data-cy='userProfileFirstName']",
      '12d',
      'Enter valid first name'
    );
  });

  // last name field validation
  it('Should show error when entering wrong last name', function () {
    cy.checkError(
      "[data-cy='userProfileLastName']",
      '',
      'Enter valid last name'
    );

    cy.checkError(
      "[data-cy='userProfileLastName']",
      '12d',
      'Enter valid last name'
    );
  });

  // home phone field validation
  it('Should show error when entering wrong home phone', function () {
    cy.checkError(
      "[data-cy='userProfileHomePhone']",
      '',
      'Enter a valid Phone Number'
    );

    cy.checkError(
      "[data-cy='userProfileHomePhone']",
      '12d',
      'Enter a valid Phone Number'
    );
  });

  // office phone field validation
  it('Should show error when entering wrong office phone', function () {
    cy.checkError(
      "[data-cy='userProfileOfficePhone']",
      '',
      'Enter valid phone number'
    );

    cy.checkError(
      "[data-cy='userProfileOfficePhone']",
      '12d',
      'Enter valid phone number'
    );
  });

  // email field validation
  it('Should show error when entering wrong email', function () {
    cy.checkError("[data-cy='userProfileEmail']", '', 'Enter a valid Email');
    cy.checkError("[data-cy='userProfileEmail']", '12d', 'Enter a valid Email');
  });

  // home and office phone equal validation
  it('Should show error when entering same home and office phone', function () {
    cy.getItem("[data-cy='userProfileHomePhone']").clear().type('1111111111');
    cy.getItem("[data-cy='userProfileOfficePhone']").clear().type('1111111111');
    cy.contains('Home phone cannot be same as office phone');
  });

  it('As a Org Admin I can upload image successfully', function () {
    const imagePath = data.image_path;
    cy.wait(1500);
    cy.get("[data-cy='file-upload']")
      // cy.get('.ant-upload-drag-container > :nth-child(1)')
      .attachFile(
        imagePath,
        {
          subjectType: 'drag-n-drop',
        },
        { force: true }
      );
    cy.wait(40000);
  });

  // Admin can Edit user profile
  it('Admin can Edit User Profile', () => {
    cy.User_Profile_Form();
    cy.wait(4000);
  });

  // recheck the information filled
  it('Should show all the data', () => {
    cy.get("[data-cy='form-cancel-link']").click();
    cy.wait(4000);
    cy.checkValue("[data-cy='userProfileFirstName']", 'Pulkit');
    cy.checkValue("[data-cy='userProfileLastName']", 'Bansal');
    cy.checkValue("[data-cy='userProfileEmail']", 'pulkit@crownstack.com');
    // cy.getItem("[data-cy='file-upload']").should('contain.html', '<img>');
  });
});
