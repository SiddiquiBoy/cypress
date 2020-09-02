///<reference types="Cypress"/>

const data = require("../../../fixtures/data.json");

// An Organization Admin can Add and Edit Business Unit Successfully
describe("An Organization Admin can Add and Edit Business Unit Successfully", function () {
  // Adimn can Login successfully
  before(function () {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password);
  });

  // Admin can Logout successfully
  after(function () {
    cy.logout();
  });

  // Navigate to the Business Units Page
  it("Navigate to the Business Units Page ", function () {
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(4) > li > div").click();
    cy.wait(2000);
    cy.get(
      " ul > section:nth-child(4) > li > ul > ul > li:nth-child(1) > a"
    ).click();
    cy.wait(4000);
  });

  // Admin can Add Business Unit Successfully
  it("Admin can Add Business Unit Successfully", function () {
    cy.wait(4000);
    cy.get(".title-container").contains("Business Units");
    cy.get(".ml-10").click();
    cy.wait(2000);

    cy.get(".title-container").contains("Add a Business Unit");
    cy.get(".ant-btn").should("not.be.enabled"); // Next Button should be disabled

    // Fill the Add Business Units Form
    cy.get(".ant-select-selection").last().should("not.be.enabled"); // Status field should be disabled
    cy.readFile("tag.json").then((data) => {
      cy.Business_unit_form(data.tag_name);
    });

    cy.wait(1000);
    cy.contains("Business Unit has been added successfully");

    // Verify the newly added Business Unit Details
    cy.Verify_business_unit_data("ACTIVE ");
  });

  // Admin can Edit Business Unit
  it("Admin can Edit Business Unit", () => {
    cy.get(
      ":nth-child(1) > :nth-child(8) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg"
    ).click({
      force: true,
    });

    cy.wait(1500);

    // Edit The Business Unit Form Details
    cy.get(".title-container").contains("Edit Business Unit");
    cy.get(".ant-select-selection")
      .last()
      .should("be.visible")
      .click()
      .get(".ant-select-dropdown-menu")
      .contains("Inactive")
      .click(); //Status field should be enabled
    cy.Business_unit_form("Test Tags");

    cy.wait(1000);
    cy.contains("Business Unit has been updated successfully");
    cy.Verify_business_unit_data("INACTIVE ");
  });

  // Admin can Activate the Business Unit from Actions Option
  it("Admin can Activate the Business Unit from Actions Option", () => {
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(7)").contains(
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
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(7)").contains(
      "ACTIVE "
    );

    // Confirm the status from Edit Page
    cy.get(
      ":nth-child(1) > :nth-child(8) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg"
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

  // Admin can Search the Business Unit by internal name, official name and email
  it("Admin can Search the Business Unit by internal name, official name and email", () => {
    cy.readFile("business_unit.json").then((data) => {
      // Search by Internal Name
      cy.get(".ant-input").last().type(data.internal_name);
      cy.wait(500);
      cy.get("table > tbody > tr:nth-child(1) >td:nth-child(2)").contains(
        data.internal_name
      );

      // Search by Official Name
      cy.get(".ant-input").last().type(data.official_name);
      cy.wait(500);
      cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3)").contains(
        data.official_name
      );

      // Search by Email
      cy.get(".ant-input").last().clear().type(data.email);
      cy.wait(500);
      cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4)").contains(
        data.email
      );
      cy.wait(500);
    });
  });
});
