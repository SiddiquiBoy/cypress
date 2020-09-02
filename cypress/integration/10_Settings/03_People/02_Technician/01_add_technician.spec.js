///<reference types="Cypress"/>
import faker from "faker";
import "cypress-file-upload";

const data = require("../../../../fixtures/data.json");

describe("Add technician", function () {
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
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      ":nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a"
    ).click();
    cy.wait(2000);
    cy.get(
      "section > app-page-header > section > section.title-content-container > section"
    ).contains("Technicians");
  });
  
  //IT- Admin can Add Technician Successfully
  it("As a Org Admin i can Add Technician Successfully", function () {
    cy.wait(2000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      ":nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a"
    ).click();
    cy.wait(2000);
    cy.get(
      "section > app-page-header > section > section.title-content-container > section"
    ).contains("Technicians");
    const bu = "Electric Markarian";
    //const bu = "Jamie";
    const status = "ACTIVE";
    cy.get(".ml-10").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Add Technician");
    cy.get(".ant-form-item-children > .mr-auto").should("not.be.enabled");
    cy.Technician_form(bu);
    cy.contains("Technician has been successfully added");
    // Verify the newly added Technician Details
    cy.Verify_tech_data(status, bu);
  });
  
  //IT- Admin can Upload Image successfully
  it("As a Org Admin i can Upload Image successfully", function () {
    cy.wait(2000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      ":nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a"
    ).click();
    cy.wait(2000);
    cy.get(
      "section > app-page-header > section > section.title-content-container > section"
    ).contains("Technicians");
    const imagePath = data.image_path;
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(8) > span").click();
    cy.wait(1500);
    cy.get(".ant-upload-drag-container > :nth-child(1)").attachFile(imagePath, {
      subjectType: "drag-n-drop",
    });
    var i = 0;
    for (i = 0; i < 3; i++) {
      cy.wait(20000);
    }
    cy.get(".ant-form-item-children > .mr-auto").click();
    cy.wait(800);
    cy.contains("Technician has been successfully updated");
    cy.wait(500);
  });
  //IT- verify the cancel button functionality
  it("As a Org admin by click on Cancel button i should move on Technician list page", function () {
    cy.wait(2000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      ":nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a"
    ).click();
    cy.wait(2000);
    cy.get(
      "section > app-page-header > section > section.title-content-container > section"
    ).contains("Technicians");

    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(8) > span > span:nth-child(2) > a > i").click()
    cy.wait(2000);
    cy.get(".title-container").contains("Edit Technician");
    cy.get("#firstname")
      .should("be.visible")
      .should("be.enabled")
      .clear()
      .type("fname");
    cy.get("#lastname").should("be.visible").clear().type("lname");
    cy.get("#officephone").should("be.visible").clear().type("7894561232");
    cy.get("#homephone").should("be.visible").clear().type("0123456789");
    cy.get("#email").should("be.visible").clear().type("asda@asd.com");
    cy.get("#businessunit > .ant-select-selection").click();
    const BU = "Electric Markarian";
    const status = "ACTIVE";
    cy.get(".ant-select-dropdown-menu >").contains(BU).click({ force: true });
    cy.get("form > nz-form-item > nz-form-control > div > span > a").click();
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:4200/settings/people/technicians");
    cy.Verify_tech_data(status, BU)

  });
  //IT- check labels of each field at add employee page
  it("At add Technician page each field should have proper labels", function () {
    cy.wait(2000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      ":nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a"
    ).click();
    cy.wait(2000);
    cy.get(
      "section > app-page-header > section > section.title-content-container > section"
    ).contains("Technicians");
    cy.get(".ml-10").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Add Technician");
    cy.get(".ant-form-item-children > .mr-auto").should("not.be.enabled");
    cy.get("[for=firstname]").contains("First Name");
    cy.get("[for=lastname]").contains("Last Name");
    cy.get(
      "form > div:nth-child(2) > div:nth-child(1) > nz-form-item > nz-form-label > label"
    ).contains("Office Phone");
    cy.get(
      "form > div:nth-child(2) > div:nth-child(2) > nz-form-item > nz-form-label > label"
    ).contains("Home Phone");
    cy.get("[for=email]").contains("Email");
    cy.get("[for=Country]").contains("Business Unit");
    cy.get("[for=firstname]").contains("First Name");
    cy.get("[for=role]").contains("Role");
    cy.get(
      "form > div:nth-child(4) > div:nth-child(2) > nz-form-item > nz-form-label > label"
    ).contains("Status");
    //cy.go("back");
  });

  //IT- check validations of each field at add Technician page
  it("At add Technician page each field should have proper valdiation", function () {
    cy.wait(2000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(
      ":nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a"
    ).click();
    cy.wait(2000);
    cy.get(
      "section > app-page-header > section > section.title-content-container > section"
    ).contains("Technicians");
    cy.get(".ml-10").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Add Technician");
    cy.get(".ant-form-item-children > .mr-auto").should("not.be.enabled");
    cy.get("#firstname").should("be.visible").should("be.enabled").type("Sahil").clear();
    cy.contains("Enter a valid first name");
    cy.get("#lastname").should("be.visible").type("Garg").clear();
    cy.contains("Enter a valid last name");
    cy.get("#officephone").should("be.visible").type("123456").clear();
    cy.contains("Enter a valid Phone Number");
    cy.get("#homephone").should("be.visible").type("123456").clear();
    cy.contains("Enter a valid Phone Number");
    cy.get("#email").should("be.visible").type("das231").clear();
    cy.contains("Enter a valid Email");
    cy.get("#firstname").should("be.visible").should("be.enabled").type("!@#$12")
    cy.contains("Enter a valid first name");
    cy.get("#lastname").should("be.visible").type("@#$%^12a")
    cy.contains("Enter a valid last name");
    cy.get("#officephone").should("be.visible").type("@#$%as12")
    cy.contains("Enter a valid Phone Number");
    cy.get("#homephone").should("be.visible").type("#$#aa2")
    cy.contains("Enter a valid Phone Number");
    cy.get("#email").should("be.visible").type("das2ds@#431")
    cy.contains("Enter a valid Email");
    //cy.go("back");
  });
});
