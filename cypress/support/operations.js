import faker, { fake } from "faker";

// Operations -> Tags Methods
Cypress.Commands.add("Tag_form", () => {
  // Add Faker data
  const color = faker.internet.color();
  const tag_name = faker.commerce.productName();
  const code = faker.random.number();

  // Write data in JSON file
  cy.writeFile("tag.json", {
    tag_color: color,
    tag_name: tag_name,
    code: code,
  });

  // Add Tag Form Data
  cy.get(
    ":nth-child(1) > .ant-col-12 > .ant-form-item > .ant-form-item-label"
  ).contains("Color");
  cy.get(".ant-form-item-control > .ant-form-item-children > .uppercase")
    .eq(1)
    .click()
    .clear()
    .type(color);

  cy.get(
    ":nth-child(2) > :nth-child(1) > .ant-form-item > .ant-form-item-label"
  ).contains("Name");
  cy.get(".titlecase").clear().type(tag_name);

  cy.get(
    ":nth-child(2) > :nth-child(2) > .ant-form-item > .ant-form-item-label"
  ).contains("Status");

  cy.get(
    ":nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label"
  ).contains("Code");
  cy.get("#code").clear().type(code);

  cy.get(
    ":nth-child(3) > :nth-child(2) > .ant-form-item > .ant-form-item-label"
  ).contains("Importance");
  cy.get("#imp > .ant-select-selection")
    .click()
    .get(".ant-select-dropdown-menu")
    .contains("Medium")
    .click();

  cy.get(".mr-auto").should("be.visible").click();
});

// Verify New Tag data
Cypress.Commands.add("Verify_tag_data", (status) => {
  cy.readFile("tag.json").then((data) => {
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3)").contains(
      data.tag_name
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4)").contains(
      data.code
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(5)").contains(
      "Medium"
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6)").contains(status);
  });
});

// Operations -> Business Units Methods

Cypress.Commands.add("Business_unit_form", (tag_name) => {
  // Add Faker data
  const internal_name = faker.name.firstName();
  const official_name = faker.name.lastName();
  const email = faker.internet.email().toLowerCase();
  const phone_number = faker.phone
    .phoneNumberFormat()
    .replace(/[^\d]/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  const street = faker.address.streetAddress();
  const zip_code = faker.address.zipCode();

  // Write data in JSON file
  cy.writeFile("business_unit.json", {
    internal_name: internal_name,
    official_name: official_name,
    email: email,
    phone: phone_number,
    street: street,
    zip_code: zip_code,
  });

  // Checking visibility of the 2 forms panel
  cy.get(
    ".ant-steps-item-active > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title"
  )
    .contains("Details")
    .should("be.visible");
  cy.get(
    ".ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title"
  ).should("not.be.enabled");

  // Add Business Unit Form Data(Part 1)
  cy.get(
    ":nth-child(1) > :nth-child(1) > :nth-child(1) > .ant-form-item-label"
  ).contains("Internal Name");
  cy.get("#name").clear().type(internal_name);

  cy.get(
    ":nth-child(2) > :nth-child(1) > .ant-form-item > .ant-form-item-label"
  ).contains("Official Name");
  cy.get(".ant-form-item-children > .text-capitalize")
    .last()
    .clear()
    .type(official_name);

  cy.get(
    ":nth-child(2) > :nth-child(2) > .ant-form-item > .ant-form-item-label"
  ).contains("Tags");
  cy.get(
    "#tags > .ant-select-selection > .ant-select-selection__rendered"
  ).type(tag_name + "{enter}");
  cy.get("#tags > div > div").click({ force: true });

  cy.get(
    ":nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label"
  ).contains("Email");
  cy.get("#email").clear().type(email);

  cy.get(
    ":nth-child(3) > :nth-child(2) > .ant-form-item > .ant-form-item-label"
  ).contains("Phone Number");
  cy.get("#phone").clear().type(phone_number);

  cy.get(
    ":nth-child(4) > :nth-child(1) > .ant-form-item > .ant-form-item-label"
  ).contains("Minimum Post Date");
  cy.get(".ant-calendar-picker-input").click();
  cy.get('[title="July 31, 2020"] > .ant-calendar-date').click({ force: true });

  cy.get(
    ":nth-child(4) > :nth-child(2) > .ant-form-item > .ant-form-item-label"
  ).contains("Status");

  cy.get(".ant-btn").should("be.enabled").click();
  cy.wait(500);

  // Add Business Unit form data(part 2)

  cy.get(
    ":nth-child(1) > :nth-child(1) > :nth-child(1) > .ant-form-item-label"
  ).contains("Street");
  cy.get("#street").clear().type(street);

  cy.get(
    ":nth-child(2) > :nth-child(1) > .ant-form-item > .ant-form-item-label"
  ).contains("Country");
  cy.get(".ant-select-selection").first().click();
  cy.get(".ant-select-dropdown-menu-item").click();

  cy.get(
    ":nth-child(2) > :nth-child(2) > .ant-form-item > .ant-form-item-label"
  ).contains("State");
  cy.get(".ant-select-selection")
    .last()
    .click()
    .get(".ant-select-dropdown-menu")
    .contains("Alaska")
    .click();

  cy.get(
    ":nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label"
  ).contains("City");
  cy.get("#city").should("be.visible").type("auto city");

  cy.get(
    ":nth-child(3) > :nth-child(2) > .ant-form-item > .ant-form-item-label"
  ).contains("Zipcode");
  cy.get("#zipcode").clear().type(zip_code);

  cy.get(".ant-btn-primary").should("be.visible").click();
});

// Verify New Business Unit data
Cypress.Commands.add("Verify_business_unit_data", (status) => {
  cy.readFile("business_unit.json").then((data) => {
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(2)").contains(
      data.internal_name
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3)").contains(
      data.official_name
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4)").contains(
      data.email
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(5)").contains(
      data.street
    );

    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6)").contains(
      "Alaska"
    );

    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(7)").contains(status);
  });
});

// Operations -> Job Type Methods
Cypress.Commands.add("Job_type_form", (tag_name) => {
  // Add Faker data
  const name = faker.name.firstName();
  const summary = faker.lorem.sentence();

  // Write data in JSON file
  cy.writeFile("job_type.json", {
    name: name,
    summary: summary,
  });

  // Add Job Type Data
  cy.get(
    ".ant-col-14 > :nth-child(1) > :nth-child(1) > .ant-form-item > .ant-form-item-label"
  ).contains("Name");
  cy.get(".titlecase").clear().type(name);

  cy.get(":nth-child(2) > .ant-form-item > .ant-form-item-label").contains(
    "Status"
  );

  cy.get(":nth-child(2) > .ant-form-item-label").contains("Tags");
  cy.get(
    "#tags > .ant-select-selection > .ant-select-selection__rendered"
  ).type(tag_name + "{enter}");
  cy.get("#tags > div > div").click({ force: true });

  cy.get(":nth-child(4) > .ant-form-item-label").contains("Summary");
  cy.get("#summary").clear().type(summary);

  cy.get(
    ":nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label"
  ).contains("Priority");
  cy.get(".ant-select-selection")
    .eq(1)
    .click()
    .get(".ant-select-dropdown-menu")
    .contains("Normal")
    .click();

  cy.get(".mr-auto").should("be.visible").click();
});

// Verify New Job Type data
Cypress.Commands.add("Verify_job_type_data", (tag_name, status) => {
  cy.readFile("job_type.json").then((data) => {
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(2)").contains(
      data.name
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3)").contains(
      "Normal"
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4)").contains(
      tag_name
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(5)").contains(status);
  });
});

// Operations -> timesheet code method
Cypress.Commands.add("Timesheet_Code_form", (type, master_pay_Bu) => {
  // Add Faker data
  const desciption = faker.lorem.paragraph();

  // Write data in JSON file
  cy.writeFile("timesheet_code.json", {
    desciption: desciption,
    type: type,
    master_pay_Bu: master_pay_Bu,
  });

  cy.get(
    "form > div:nth-child(1) > div:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div"
  ).click();
  cy.get(".ant-select-dropdown-menu >").contains(type).click();
  cy.get(
    "form > div:nth-child(2) > div > nz-form-item > nz-form-control > div > span > nz-select > div"
  ).click();
  cy.wait(1000);
  cy.get(".ant-select-dropdown-menu >").contains(master_pay_Bu).click();
  cy.get(
    "form > nz-form-item:nth-child(3) > nz-form-control > div > span > textarea"
  )
    .should("be.visible")
    .clear()
    .type(desciption);
  cy.get(".mr-auto").should("be.enabled").click();
});

// verify new timesheet code data
Cypress.Commands.add("verify_timesheet_code_data", (status) => {
  cy.readFile("timesheet_code.json").then((data) => {

    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3) > span").contains(
      data.type.toLowerCase()
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4) > span").contains(
      data.master_pay_Bu
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(5) > span").contains(
      data.desciption
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6) > span").contains(
      status.toUpperCase()
    );

  });
});
