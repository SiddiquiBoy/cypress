///<reference types="Cypress"/>

const data = require("../../../fixtures/data.json");

// An Organization Admin can Add and Edit Tag Successfully
describe("An Organization Admin can Add Tag", function () {
  // Adimn can Login successfully
  before(function () {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password);
  });

  // Admin can Logout successfully
  after(function () {
    cy.logout();
  });

  // Navigate to the Tag Page
  it("Navigate to the Tag Page ", function () {
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(4) > li > div").click();
    cy.wait(2000);
    cy.get(
      " ul > section:nth-child(4) > li > ul > ul > li:nth-child(3) > a"
    ).click();
    cy.wait(4000);
  });

  // Admin can Add Tag Successfully
  it("Admin can Add Tag Successfully", function () {
    cy.wait(4000);
    cy.get(".title-container").contains("Tags");
    cy.get(".ml-10").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Add a Tag");
    cy.get(".mr-auto").should("not.be.enabled");

    // Fill the Add Tag Form
    cy.get(".ant-select-selection").first().should("not.be.enabled"); // Status field should be disabled
    cy.Tag_form();

    cy.wait(1000);
    cy.contains("Tag added successfully");

    // Verify the newly added Employee Details
    cy.Verify_tag_data("ACTIVE ");
  });

  // Admin can Edit Tag
  it("Admin can Edit Tag", () => {
    cy.get(
      ":nth-child(1) > :nth-child(7) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg"
    ).click({
      force: true,
    });

    cy.wait(1500);

    // Edit The Tag Form Details
    cy.get(".title-container").contains("Edit Tag");
    cy.get(".ant-select-selection")
      .first()
      .should("be.visible")
      .click()
      .get(".ant-select-dropdown-menu")
      .contains("Inactive")
      .click(); //Status field should be enabled
    cy.Tag_form();

    cy.wait(1000);
    cy.contains("Tag updated successfully");
    cy.Verify_tag_data("INACTIVE ");
  });

  // Admin can Activate the Tag from Actions Option
  it("Admin can Activate the Tag from Actions Option", () => {
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6)").contains(
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
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6)").contains(
      "ACTIVE "
    );

    // Confirm the status from Edit Page
    cy.get(
      ":nth-child(1) > :nth-child(7) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg"
    ).click({
      force: true,
    });
    cy.get(".ant-select-selection")
      .first()
      .should("be.visible")
      .contains("Active");
    cy.get(".link").click();
    cy.wait(2500);
  });

  // Admin can Search the Tag by name and code
  it("Admin can Search the Tag by name and code", () => {
    cy.readFile("tag.json").then((data) => {
      // Search by Tag Name
      cy.get(".ant-input").last().type(data.tag_name);
      cy.wait(500);
      cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3)").contains(
        data.tag_name
      );

      // Search by Code
      cy.get(".ant-input").last().clear().type(data.code);
      cy.wait(500);
      cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4)").contains(
        data.code
      );
      cy.wait(500);
    });
  });
});
