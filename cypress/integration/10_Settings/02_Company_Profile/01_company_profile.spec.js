///<reference types="Cypress"/>
import faker from "faker";
import "cypress-file-upload";
import { readFile } from "fs";
const data = require("../../../fixtures/data.json");
import 'cypress-wait-until';


describe('Company module', () => {

  beforeEach("Login", () => {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
  })
  afterEach("Logout", () => {
    cy.logout()
  })

  //IT- Admin can navigate on company profile
  it('As a Org Admin, Navigate to the Company Profile page', () => {
    //cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    cy.wait(2000)
    cy.get('.setting-position > a').click()
    cy.get('ul > section:nth-child(2) > li > a').click()
    cy.url().should('include', 'settings/profile')

  })
  //IT- to check the each field validation
  it("Each field should have proper validation at Company Profile page ", function () {
    cy.wait(2000)
    cy.get('.setting-position > a').click()
    cy.get('ul > section:nth-child(2) > li > a').click()
    cy.url().should('include', 'settings/profile')
    cy.wait(2000)
    cy.get('#name').should('be.visible').clear()
    cy.contains("Enter a Company Name")
    cy.get('#city').should('be.visible').clear().type("2112212")
    cy.contains("Enter a valid City")
    cy.get('#zipcode').should('be.visible').clear().type("dasd")
    cy.contains("Enter a valid Zipcode")
    cy.get('#contact').clear().type("21312")
    cy.contains("Enter a valid Phone Number")
    cy.get('nz-form-control > div > span > button').should('not.be.enabled')
    cy.wait(2000)
    //cy.go("back")
  })
  //IT- to check each field lebals
  it("Each field should have proper lebal at Company Profile page ", function () {
    cy.wait(2000)
    cy.get('.setting-position > a').click()
    cy.get('ul > section:nth-child(2) > li > a').click()
    cy.url().should('include', 'settings/profile')
    cy.get(':nth-child(2) > .ant-form-item-label > label').contains("Address");
    cy.get(':nth-child(4) > :nth-child(1) > .ant-form-item > .ant-form-item-label > label').contains("City");
    cy.get(':nth-child(3) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("State");
    cy.get(':nth-child(4) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("Zip Code");
    cy.get(':nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label > label').contains("Country");
    cy.get(':nth-child(5) > .ant-col-12 > .ant-form-item > .ant-form-item-label > label').contains("Phone Number");
    // cy.go('back');
  })

  //IT- to update the company profile details 
  it('As a Org Admin i should be able to update the company details', () => {
    cy.wait(2000)
    cy.get('.setting-position > a').click()
    cy.get('ul > section:nth-child(2) > li > a').click()
    cy.url().should('include', 'settings/profile')
    cy.wait(2000)
    cy.Company_form();
    cy.Verify_comp_data();
  })

  //IT- to upload the Company profile logo
  it("As a Org Admin i should be able to update company Profile logo", function () {
    cy.wait(2000)
    cy.get('.setting-position > a').click()
    cy.get('ul > section:nth-child(2) > li > a').click()
    cy.url().should('include', 'settings/profile')
    const imagePath = data.image_path;
    cy.wait(1500);
    cy.get(".ant-upload-drag-container > :nth-child(1)").attachFile(imagePath, { subjectType: "drag-n-drop", });

    var i = 0;
    for (i = 0; i < 3; i++) {
      cy.wait(20000);
    }
    cy.get(".ant-form-item-children > .mr-auto").click();
    cy.wait(800);
    cy.waitUntil(() => cy.contains('Company Profile has been successfully updated'))
    cy.wait(500);
  });

  //IT- logout and verify the company name on the top of the dashboard 
  it("Admin should be able to see the company name on top of dashboard", function () {
    cy.wait(1000)
    cy.readFile("company.json").then((data) => {
      cy.get('.header-client-logo > p').contains(data.company_name);
    });
  })
  //IT- to check cancel button functionality on company profile page 
  it("Verify the cancel functionality on Company profile page", function () {
    cy.wait(2000)
    cy.get('.setting-position > a').click()
    cy.get('ul > section:nth-child(2) > li > a').click()
    cy.url().should('include', 'settings/profile')
    cy.wait(2000)
    cy.get('#name').should('be.visible').clear().type("xyz")
    cy.get('#address').should('be.visible').clear().type("abc")
    cy.get('#city').should('be.visible').clear().type("demo city")
    cy.get('#zipcode').should('be.visible').clear().type("1233")
    cy.get('#contact').should('be.visible').clear().type("9999999")
    cy.get("form > nz-form-item.register-area.text-right.ant-form-item.ant-row > nz-form-control > div > span > a").click()
    cy.wait(2000)
    cy.Verify_comp_data();
  });
});