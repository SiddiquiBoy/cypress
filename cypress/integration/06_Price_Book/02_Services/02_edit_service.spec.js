///<reference types="Cypress"/>
import "cypress-file-upload";

const data = require("../../../fixtures/data.json");

// An Organization Admin can Add and Edit Price Book Services Successfully
describe("Add Service", function () {
  beforeEach("Login", () => {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
  })
  afterEach("Logout", () => {
    cy.logout()
  })

  it("As A Org Admin I should be able to navigate on Edit service Page", () => {
    cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
    cy.wait(2000);
    cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Services");
    cy.get(":nth-child(2) > :nth-child(9) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg").click({ force: true, });
    cy.wait(1500);
    cy.get(".title-container").contains("Edit a Service");
  })

  // Admin can Edit Service
  it("As a Org Admin I can Edit Service", () => {
    cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
    cy.wait(2000);
    cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Services");
    cy.get(":nth-child(1) > :nth-child(9) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg").click({ force: true, });
    cy.wait(1500);
    // Edit The Service Form Details
    cy.get(".title-container").contains("Edit a Service");
    cy.get(".ant-select-selection")
      .last()
      .should("be.visible")
      .click()
      .get(".ant-select-dropdown-menu")
      .contains("Inactive")
      .click(); //Status field should be enabled
    //cy.Service_form("Test Category");
    cy.wait(1000);
    cy.get("form > nz-form-item > nz-form-control > div > span > button").click().wait(450)
    cy.contains("Service has been successfully updated");
    cy.readFile("service.json").then((data) => {
      cy.get("table > tbody > tr:nth-child(1) > td:nth-child(3) > span").contains(data.service_name)
      cy.get("table > tbody > tr:nth-child(1) > td:nth-child(4) > span").contains(data.description)
      cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span").contains("$" + data.price)
      cy.get("table > tbody > tr:nth-child(1) > td:nth-child(8) > span").contains("INACTIVE")
    })
  })

  // IT - Admin can Upload Image successfully
  it("As a Org Admin i can Upload Image successfully", function () {
    cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
    cy.wait(2000);
    cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Services");
    cy.get(":nth-child(1) > :nth-child(9) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg").click({ force: true, });
    cy.wait(1500);
    cy.get(".title-container").contains("Edit a Service");
    cy.wait(2000);
    const imagePath = data.image_path;
    cy.wait(3000);
    cy.get(".ant-upload-drag-container > :nth-child(1)").attachFile(imagePath, {
      subjectType: "drag-n-drop",
    });
    var i = 0;
    for (i = 0; i < 3; i++) {
      cy.wait(20000);
    }
    cy.get(".ant-form-item-children > .mr-auto").click();
    cy.wait(800);
    cy.contains("Service has been successfully updated");
    cy.wait(500);
  });
})