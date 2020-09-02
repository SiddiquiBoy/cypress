///<reference types="Cypress"/>
import faker from "faker";
import "cypress-file-upload";
const data = require("../../../../fixtures/data.json");

// An Organization Admin can Add and Edit Employee Successfully
describe("Add Employee", function () {
  beforeEach("Login", () => {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
  })
  afterEach("Logout", () => {
    cy.logout()
  })
    
  //IT- Navigate to the Employee Page
  it("As a Org Admin, navigate to the Employee Page", function () {
    cy.wait(3000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(" ul > section:nth-child(3) > li > ul > ul > li:nth-child(1) > a").click();
    cy.wait(1000);
    cy.get(".title-container").contains("Employees");
  });

  //IT- Admin can Add Employee Successfully
  it("As a Org Admin i can Add Employee Successfully", function () {
    cy.wait(3000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(" ul > section:nth-child(3) > li > ul > ul > li:nth-child(1) > a").click();
    cy.wait(1000);
    cy.get(".title-container").contains("Employees");
    //const bu = "Jamie";
    const bu = "Electric Markarian";
    const status = "ACTIVE";
    cy.get(".ml-10").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Add Employee");
    cy.get(".ant-form-item-children > .mr-auto").should("not.be.enabled");
    cy.Employee_form(bu);
    cy.wait(1000);
    cy.contains("Employee has been successfully added");
    // Verify the newly added Employee Details
    cy.Verify_Emp_data(status);
  });
  
  //IT- Admin can Upload Image successfully
  it("As a Org Admin I can Upload Image successfully", function () {
    cy.wait(3000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(" ul > section:nth-child(3) > li > ul > ul > li:nth-child(1) > a").click();
    cy.wait(1000);
    cy.get(".title-container").contains("Employees");
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
    cy.contains("Employee has been successfully updated");
    cy.wait(500);
  });
  
  //IT- verify the cancel button functionality
  it("Verify the cancel Functionality", function () {
    cy.wait(3000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(" ul > section:nth-child(3) > li > ul > ul > li:nth-child(1) > a").click();
    cy.wait(1000);
    cy.get(".title-container").contains("Employees");
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(8) > span > span:nth-child(2) > a > i").click()
    cy.wait(2000);
    cy.get(".title-container").contains("Edit Employee");
    cy.get("#firstname")
      .should("be.visible")
      .should("be.enabled")
      .clear()
      .type("name");
    cy.get("#lastname").should("be.visible").clear().type("lname");
    cy.get("#officephone").should("be.visible").clear().type("4561235121");
    cy.get("#homephone").should("be.visible").clear().type("0011223344");
    cy.get("#email").should("be.visible").clear().type("sa@assd.com");
    cy.get("#businessunit > .ant-select-selection").click();
    const bu = "Electric Markarian";
    cy.get(".ant-select-dropdown-menu >").contains(bu).click({ force: true });
    cy.get("form > nz-form-item > nz-form-control > div > span > a").click();
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:4200/settings/people/employees");
    const status = "ACTIVE"
    cy.Verify_Emp_data(status)
  });

  //IT- check lebals of each field at add employee page
  it("At add Employee page each field should have proper labels", function () {
    cy.wait(3000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(" ul > section:nth-child(3) > li > ul > ul > li:nth-child(1) > a").click();
    cy.wait(1000);
    cy.get(".title-container").contains("Employees");
    cy.get(".ml-10").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Add Employee");
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
  
  //IT- check validations of each field at add employee page
  it("At add Employee page each field should have proper valdiation", function () {
    cy.wait(3000);
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(" ul > section:nth-child(3) > li > ul > ul > li:nth-child(1) > a").click();
    cy.wait(1000);
    cy.get(".title-container").contains("Employees");
    cy.get(".ml-10").click();
    cy.wait(2000);
    cy.get(".title-container").contains("Add Employee");
    cy.get(".ant-form-item-children > .mr-auto").should("not.be.enabled");
    cy.get("#firstname").should("be.visible").should("be.enabled").type("Sahil").clear()
    cy.contains("Enter a valid first name");
    cy.get("#lastname").should("be.visible").type("Garg").clear();
    cy.contains("Enter a valid last name");
    cy.get("#officephone").should("be.visible").type("123456").clear();
    cy.contains("Enter a valid Phone Number");
    cy.get("#homephone").should("be.visible").type("123456").clear();
    cy.contains("Enter a valid Phone Number");
    cy.get("#email").should("be.visible").type("das231").clear();
    cy.contains("Enter a valid Email");
    cy.get("#firstname").should("be.visible").should("be.enabled").type("!@#$12hil")
    cy.contains("Enter a valid first name");
    cy.get("#lastname").should("be.visible").type("@#$%12a")
    cy.contains("Enter a valid last name");
    cy.get("#officephone").should("be.visible").type("@#$%^hhg")
    cy.contains("Enter a valid Phone Number");
    cy.get("#homephone").should("be.visible").type("ERT12a")
    cy.contains("Enter a valid Phone Number");
    cy.get("#email").should("be.visible").type("das231s@asd@.com")
    cy.contains("Enter a valid Email");
    //cy.go("back");
  });
});
