///<reference types="Cypress"/>

const data = require("../../fixtures/data.json");

context("An Org Admin can Login and Logout successfully", () => {

  //IT - to login with the valid credential
  it("An Org Admin can Login with the valid username and password", () => {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password);
    cy.url().should("include", "/dashboard");
    // Checks navigation bar features exists and works properly
    // cy.get(".user-name-container").contains("Pulkit Bansal");
    // Check Sidebar features exists and works properly
    cy.url().should('include', '/dashboard')
    cy.get("[ng-reflect-nz-title=Jobs] > a").click().url().should('include', '/jobs')
    cy.get("section > nz-layout > nz-sider > div > ul > li:nth-child(8) > a").click().url().should('include', '/projects')
    cy.get("section > nz-layout > nz-sider > div > ul > li:nth-child(7) > a").click().url().should('include', '/customers')
    cy.get("section > nz-layout > nz-sider > div > ul > li:nth-child(6) > a").click().url().should('include', '/priceBook')
    cy.get("section > nz-layout > nz-sider > div > ul > li:nth-child(4) > a").click().url().should('include', '/invoice')
    cy.get("section > nz-layout > nz-sider > div > ul > li:nth-child(3) > a").click().url().should('include', '/dispatch')
    cy.get("section > nz-layout > nz-sider > div > ul > li:nth-child(2) > a").click().url().should('include', '/schedule')
    cy.get('.setting-position > a').click().url().should('include', '/settings')
    cy.wait(500);
    // Admin logout successfully
    cy.logout();

  });

  //IT- As a Admin I cannot login with invalid username and password
  it('As a Org Admin I cannot login with the invalid username and password', () => {

    cy.login(data.base_url, 'pulki@ca.com', 'passcoded')
    cy.contains('Either email or password is wrong')
  })

  //IT- Email and password field should have validations 
  it('For Org Admin, Email and password field should have validation', () => {

    cy.visit(data.base_url + '/login')
    cy.get('[placeholder=Email]').should('be.visible').click()
    cy.get('.login-form-container').click()
    cy.should('contain.text', 'Please input a valid email!')
    cy.get('[placeholder=Password]').should('be.visible').type('dsadadas').clear()
    cy.wait(1000)
    cy.contains('Please input your password!')
    cy.should('have.text', 'Please input your password!')
  })

  //IT- An validation should occur when i use invalid email format
  it('As a Org Admin if i use invalid format Username then validation should occur', () => {


    cy.login(data.base_url, 'pul@ki@ca.com', 'passcoded')
    cy.should('contain.text', 'Email format is invalid')

  })

  // IT- An admin should be able to view the link of forgot password and register link on login page 
  it('As a Org Admin i should be able to see the forgot password and register link on login page', () => {
    cy.visit(data.base_url + '/login')
    cy.wait(2000)
    cy.get('.login-form-forgot').should('be.visible')
    cy.get('#registerLink').should('be.visible')
  })


});
