///<reference types="Cypress"/>
import faker from "faker";
import "cypress-file-upload";
const data = require("../../../../fixtures/data.json");

describe("Edit Technician", function () {
  beforeEach("Login", () => {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
  })
  afterEach("Logout", () => {
    cy.logout()
  })
  //IT- Navigate to the Technician Page
  it("As a Org Admin, navigate to the Technician Page", function () {
    cy.wait(2000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get("nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      ":nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a"
    ).click();
    cy.wait(1000);
    cy.get(
      "section > app-page-header > section > section.title-content-container > section"
    ).contains("Technicians");
  });
  //IT- Admin can edit the Technician details
  it("As a Org admin I can edit the Technician details", function () {
    cy.wait(2000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get("nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      ":nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a"
    ).click();
    cy.wait(1000);
    cy.get(
      "section > app-page-header > section > section.title-content-container > section"
    ).contains("Technicians");
    const status = "INACTIVE";
    //const bu = "Solar Panels";
    const bu = "Ruben";
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(8) > span").click();
    cy.url().should("include", "/edit");
    cy.get("#status > .ant-select-selection").click();
    cy.get(".ant-select-dropdown-menu >").contains("Inactive").click();
    cy.Technician_form(bu);
    cy.wait(1000);
    cy.contains("Technician has been successfully updated");
    // Verify the updated Technician Details in Technician table
    cy.Verify_tech_data(status, bu);
  });

});
