///<reference types="Cypress"/>
import faker from "faker";
import "cypress-file-upload";

const data = require("../../../../fixtures/data.json");

describe("Edit Employee", function () {

  beforeEach("Login", () => {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
  })
  afterEach("Logout", () => {
    cy.logout()
  })

  //IT- Navigate to the Employee Page
  it("As a Org Admin, navigate to the Employee Page", function () {
    cy.wait(1000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      " ul > section:nth-child(3) > li > ul > ul > li:nth-child(1) > a"
    ).click();
    cy.wait(2000);
    cy.get(".title-container").contains("Employees");
  });

  //IT- Admin can edit the employee details
  it("As a Org admin I can edit the Employee details", function () {
    cy.wait(1000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      " ul > section:nth-child(3) > li > ul > ul > li:nth-child(1) > a"
    ).click();
    cy.wait(2000);
    cy.get(".title-container").contains("Employees");
    const bu = "Jacey";
    //const bu = "Willie";
    const status = "INACTIVE";
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(8) > span").click();
    cy.url().should("include", "/edit");
    cy.wait(2000);
    cy.get("#status > .ant-select-selection").click();
    cy.get(".ant-select-dropdown-menu >").contains("Inactive").click();
    cy.Employee_form(bu);
    cy.wait(1000);
    cy.contains("Employee has been successfully updated");
    // Verify the updated Employee Details in employee table
    cy.Verify_Emp_data(status);
  });
});
