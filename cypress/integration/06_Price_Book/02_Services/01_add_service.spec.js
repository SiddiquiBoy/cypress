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

  // Navigate to the Price Book Services Page
  it("As a org Admin I should be able to navigate on Add Service page", function () {
    cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
    cy.wait(2000);
    cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Services");
    cy.get(".ml-10").click();
    cy.get(".title-container").contains("Add a Service");

  });

  // Admin can Add Service Successfully
  it("As a Org Admin I can Add Service Successfully", function () {
    cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
    cy.wait(2000);
    cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Services");
    cy.get(".ml-10").click();
    cy.get(".title-container").contains("Add a Service");
    cy.get(".mr-auto").should("not.be.enabled");
    // Fill the Add Servide Form
    cy.get(".ant-select-selection").last().should("not.be.enabled"); // Status field should be disabled
    const category = "Heidi"
    const status = "ACTIVE"
    cy.Service_form(category);
    cy.get(".mr-auto").should("be.visible").click();
    cy.wait(1000);
    cy.contains("Service has been successfully added");
    // Verify the newly added Service Details
    cy.Verify_service_data(category, status);
  });

  it("At Add Searvice page each editable field should have proper validation", () => {
    cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
    cy.wait(2000);
    cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Services");
    cy.get(".ml-10").click();
    cy.get(".title-container").contains("Add a Service");
    cy.get(".mr-auto").should("not.be.enabled");
    cy.get(".titlecase").clear().type("SDA@wda").clear()
    cy.contains("Invalid/Duplicate Name")
    cy.get("form > div:nth-child(2) > div:nth-child(1) > nz-form-item > nz-form-control > div > span > textarea").clear().type("desc").clear()
    cy.contains("Enter Item Description")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").first().clear().type("sda");
    cy.contains("Enter a valid amount")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").eq(1).clear().type("sad");
    cy.contains("Enter a valid amount")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").eq(2).clear().type("das");
    cy.contains("Enter a valid amount")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").last().clear().type("sda");
    cy.contains("Enter a valid amount")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input").last().clear().type("video_link")
    cy.contains("Enter Video Link")
  })

  it("Verify the cancel functionality on Add service page", () => { 
    cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
    cy.wait(2000);
    cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Services");
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(9) > span > span > a > i").click().wait(1000)
    cy.get("app-page-header > section > section.title-content-container > section").contains("Edit a Service")
    cy.get(".titlecase").clear().type("test service")
    cy.get("form > div:nth-child(2) > div:nth-child(1) > nz-form-item > nz-form-control > div > span > textarea").clear().type("desc")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").first().type("1");
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").eq(1).clear().type("2");
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").eq(2).clear().type("3");
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").last().clear().type("4");
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input").last().clear().type("video_link")
    cy.contains("Enter Video Link")
    cy.get("form > nz-form-item > nz-form-control > div > span > a").click()
    cy.wait(3000);
    cy.get(".title-container").contains("Services");
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(9) > span > span > a > i").click().wait(2000)
    cy.get("app-page-header > section > section.title-content-container > section").contains("Edit a Service")
    cy.get(".titlecase").should("not.have.value","test service")
    cy.get("form > div:nth-child(2) > div:nth-child(1) > nz-form-item > nz-form-control > div > span > textarea").should("not.have.value","desc")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").first().should("not.have.value","1")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").eq(1).should("not.have.value","2")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").eq(2).should("not.have.value","3")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input").last().should("not.have.value","4")
    cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input").last().clear().should("not.have.value","video_link")
    
  })
})