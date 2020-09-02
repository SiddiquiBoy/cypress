///<reference types="Cypress"/>

import faker from "faker";

const vendorName= faker.name.firstName();
const city= faker.address.state()
const street= faker.address.streetAddress();
const landmark=faker.address.streetName()
const zipcode= faker.address.zipCode()
const firstName= faker.name.firstName();
const lastName= faker.name.lastName();
const email=faker.internet.email()
const phone=faker.phone.phoneNumber()
const fax=faker.phone.phoneNumber()
const memo= faker.lorem.sentence()
const updatedFax= faker.phone.phoneNumber()
const updatedCity = faker.address.city()

const data = require("../../fixtures/data.json");

describe("", function () {
  // Adimn can Login successfully
  before(function () {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password);
  });

  // Admin can Logout successfully
  after(function () {
    cy.logout();
  });

  // Navigate to the Vendor's Page
  it("Navigate to the Vendor's Page ", function () {
    cy.get('[ng-reflect-nz-title="Vendors"] > a').click()
    cy.wait(4000);
    cy.url().should('have.string','/vendors')

  });

  it('navigate to add vendor page ',function()
  {
       cy.get('.ml-10').click()
       cy.url().should('have.string','/vendors/add')
       cy.wait(1000);

  })

  // Admin can Add Vendor
  it("Admin can add vendor", () => {

    cy.get("[data-cy='vendorName']").clear().type(vendorName);
    cy.get("[data-cy='city']").clear().type(city);
    cy.get("[data-cy='street']").clear().type(street);
    cy.get("[data-cy='landmark']").clear().type(landmark);
    cy.get("[data-cy='zipcode']").clear().type(zipcode);
    cy.get("[data-cy='state']")
      .click()
      .get(".ant-select-dropdown-menu > :nth-child(1)")
      .click();
    cy.get("[data-cy='next']").click();
    cy.get("[data-cy='firstName']").clear().type(firstName);
    cy.get("[data-cy='lastName']").clear().type(lastName);
    cy.get("[data-cy='email']").clear().type(email);
    cy.get("[data-cy='tags']")
    .click()
    .get(".ant-select-dropdown-menu > :nth-child(1)")
    .click();
    cy.wait(1000);
    cy.get('body > div')
    cy.get(".cdk-overlay-backdrop").click({
      force: true
    })
    cy.get("[data-cy='phone']").clear().type(phone);
    cy.get("[data-cy='fax']").clear().type(fax);
    cy.get("[data-cy='memo']").clear().type(memo);
   
    cy.wait(1000);
    cy.get("[data-cy='submit']").click();
    cy.wait(2000);

    cy.contains("Vendor has been added successfully");

  });

  it("Admin can edit vendor", () => {

    cy.get(
      ":nth-child(1) > :nth-child(7) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg"
    ).click({
      force: true,
    });

    cy.wait(2000);
    cy.get(".title-container").contains("Edit Vendor");
    cy.get("[data-cy='city']").clear().type(updatedCity);
    cy.get("[data-cy='state']")
        .click()
        .get(".ant-select-dropdown-menu > :nth-child(3)")
        .click();    cy.get("[data-cy='next']").click();
    cy.get("[data-cy='fax']").clear().type(updatedFax);
    cy.get("[data-cy='submit']").click();
    cy.wait(2000);
    cy.contains("Vendor updated successfully");
    cy.wait(2000);

  });

  it("Admin can update vendor status", () => {

    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6)").contains(
      "ACTIVE "
    );
    cy.get(
      ".ant-table-tbody > :nth-child(1) > .ant-table-selection-column"
    ).click();
    cy.get(".flex-center")
      .click()
      .get('[ng-reflect-nz-disabled="false"] > a')
      .click();
    cy.contains("Status has been successfully updated");
    cy.wait(800);
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6)").contains(
      "INACTIVE "
    );

    cy.wait(2500);
  });

});
