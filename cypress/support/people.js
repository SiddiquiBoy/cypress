import faker from "faker";

// operation - > Employee Methods
Cypress.Commands.add("Employee_form", (BU) => {
  // Add Faker data for input fields
  const fname = faker.name.firstName().trim();
  const lname = faker.name.lastName().trim();
  const office_phone = faker.phone
    .phoneNumberFormat()
    .replace(/[^\d]/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  const home_phone = faker.phone
    .phoneNumberFormat()
    .replace(/[^\d]/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  const email = faker.internet.email().toLowerCase();

  // Write data in JSON file
  cy.writeFile("employee.json", {
    fname: fname,
    lname: lname,
    office_phone: office_phone,
    home_phone: home_phone,
    email: email,
    bu: BU,
  });

  // Fill the Add Employee Form
  cy.get("#firstname")
    .should("be.visible")
    .should("be.enabled")
    .clear()
    .type(fname);
  cy.get("#lastname").should("be.visible").clear().type(lname);
  cy.get("#officephone").should("be.visible").clear().type(office_phone);
  cy.get("#homephone").should("be.visible").clear().type(home_phone);
  cy.get("#email").should("be.visible").clear().type(email);
  cy.get("#businessunit > .ant-select-selection").click();
  cy.get(".ant-select-dropdown-menu >").contains(BU).click({ force: true });
  cy.get("#role > .ant-select-selection").click();
  cy.get(".ant-select-dropdown-menu-item").click();
  cy.get(".ant-form-item-children > .mr-auto")
    .should("be.enabled")
    .click({ force: true });
});

Cypress.Commands.add("Verify_Emp_data", (status) => {
  cy.readFile("employee.json").then((data) => {
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(2)").should(
      "contain.text",
      data.fname + " " + data.lname
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3) > span").contains(
      data.office_phone
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4) > span").contains(
      data.email
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(5) > span").contains(
      data.bu
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6) > span").contains(
      " Company Admin "
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(7) > span").contains(
      status
    );
    cy.wait(4000)
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(8) > span > span:nth-child(2) > a > i").click();
    cy.wait(4000)
    cy.get("#firstname").should("have.value", data.fname)
    cy.get("#lastname").should("have.value", data.lname)
    cy.get("#officephone").should("have.value", data.office_phone)
    cy.get("#homephone").should("have.value", data.home_phone)
    cy.get("#email").should("have.value", data.email)
  });
});

Cypress.Commands.add("Technician_form", (BU) => {
  // Add Faker data for input fields
  const fname = faker.name.firstName();
  const lname = faker.name.lastName();
  const office_phone = faker.phone
    .phoneNumberFormat()
    .replace(/[^\d]/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  const home_phone = faker.phone
    .phoneNumberFormat()
    .replace(/[^\d]/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  const email = faker.internet.email().toLowerCase();

  // Write data in JSON file
  cy.writeFile("technician.json", {
    fname: fname,
    lname: lname,
    office_phone: office_phone,
    home_phone: home_phone,
    email: email,
    bu: BU,
  });
  // Fill the Add Technician Form
  cy.get("#firstname")
    .should("be.visible")
    .should("be.enabled")
    .clear()
    .type(fname);
  cy.get("#lastname").should("be.visible").clear().type(lname);
  cy.get("#officephone").should("be.visible").clear().type(office_phone);
  cy.get("#homephone").should("be.visible").clear().type(home_phone);
  cy.get("#email").should("be.visible").clear().type(email);
  cy.get("#businessunit > .ant-select-selection").click();
  cy.get(".ant-select-dropdown-menu >").contains(BU).click({ force: true });
  cy.wait(1000);
  cy.get(".ant-form-item-children > .mr-auto")
    .should("be.enabled")
    .click({ force: true });
  cy.wait(1000);
});

Cypress.Commands.add("Verify_tech_data", (status, BU) => {
  cy.readFile("technician.json").then((data) => {
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(2)").should(
      "contain.text",
      data.fname + " " + data.lname
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3) > span").contains(
      data.office_phone
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4) > span").contains(
      data.email
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(5) > span").contains(
      BU
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6) > span").contains(
      " Technician "
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(7) > span").contains(
      status
    );
    cy.wait(4000)
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(8) > span > span:nth-child(2) > a > i").click();
    cy.wait(4000)
    cy.get("#firstname").should("have.value", data.fname)
    cy.get("#lastname").should("have.value", data.lname)
    cy.get("#officephone").should("have.value", data.office_phone)
    cy.get("#homephone").should("have.value", data.home_phone)
    cy.get("#email").should("have.value", data.email)
  });
});
