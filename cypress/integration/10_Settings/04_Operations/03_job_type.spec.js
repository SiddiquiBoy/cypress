///<reference types="Cypress"/>

const data = require("../../../fixtures/data.json");

// An Organization Admin can Add and Edit Job Type Successfully
describe("An Organization Admin can Add and Edit Job Type Successfully", function () {
  // Adimn can Login successfully
  before(function () {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password);
  });

  // Admin can Logout successfully
  after(function () {
    cy.logout();
  });

  // Navigate to the Job Type Page
  it("Navigate to the Job Type Page ", function () {
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(4) > li > div").click();
    cy.wait(2000);
    cy.get(
      " ul > section:nth-child(4) > li > ul > ul > li:nth-child(2) > a"
    ).click();
    cy.wait(4000);
  });

  // Admin can Add Job Type Successfully
  it("Admin can Add Job Type Successfully", function () {
    cy.wait(4000);
    cy.get(".title-container").contains("Job Type");
    cy.get(".ml-10").click();
    cy.wait(2000);

    cy.get(".title-container").contains("Add a Job Type");
    cy.get(".ant-btn").should("not.be.enabled"); // Next Button should be disabled

    // Fill the Add Job Type Form
    cy.get(".ant-select-selection").last().should("not.be.enabled"); // Status field should be disabled
    cy.readFile("tag.json").then((data) => {
      cy.Job_type_form(data.tag_name);

      cy.wait(1000);
      cy.contains("Job type added successfully");

      // Verify the newly added Job Type Details
      cy.Verify_job_type_data(data.tag_name, "ACTIVE ");
    });
  });

  // Admin can Edit Job Type
  it("Admin can Edit Job Type", () => {
    cy.get(
      ":nth-child(1) > :nth-child(6) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg"
    ).click({
      force: true,
    });

    cy.wait(1500);

    // Edit The Job Type Form Details
    cy.get(".title-container").contains("Edit Job Type");
    cy.get(".ant-select-selection")
      .last()
      .should("be.visible")
      .click()
      .get(".ant-select-dropdown-menu")
      .contains("Inactive")
      .click(); //Status field should be enabled
    cy.Job_type_form("Test Tags");

    cy.wait(1000);
    cy.contains("Job type updated successfully");
    cy.Verify_job_type_data("Test Tags", "INACTIVE ");
  });

  // Admin can Activate the Job Type from Actions Option
  it("Admin can Activate the Job Type from Actions Option", () => {
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(5)").contains(
      "INACTIVE "
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
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(5)").contains(
      "ACTIVE "
    );

    // Confirm the status from Edit Page
    cy.get(
      ":nth-child(1) > :nth-child(6) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg"
    ).click({
      force: true,
    });
    cy.get(".ant-select-selection")
      .last()
      .should("be.visible")
      .contains("Active");
    cy.get(".link").click();
    cy.wait(2500);
  });

  // Admin can Search the Job Type by Name
  it("Admin can Search the Job Type by Name", () => {
    cy.readFile("job_type.json").then((data) => {
      // Search by Name
      cy.get(".ant-input").last().type(data.name);
      cy.wait(500);
      cy.get("table > tbody > tr:nth-child(1) >td:nth-child(2)").contains(
        data.name
      );
      cy.wait(500);
    });
  });
});
