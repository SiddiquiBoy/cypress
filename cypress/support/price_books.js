import faker, { fake } from "faker";

// Price Books -> Service Methods
Cypress.Commands.add("Service_form", (category) => {
  // Add Faker data
  
  const service_name = faker.commerce.productName();
  const description = faker.lorem.sentence();
  const price = faker.commerce.price();
  const member_price = faker.commerce.price();
  const add_on_price = faker.commerce.price();
  const bonus_price = faker.commerce.price();
  const video_link = faker.internet.url();
  const category = category
  // Write data in JSON file
  cy.writeFile("service.json", {
    service_name: service_name,
    description: description,
    price: price,
    member_price: member_price,
    add_on_price: add_on_price,
    bonus_price: bonus_price,
    video_link: video_link,
    category: category
  });

  // Add Service Form Data
  
  cy.get(".titlecase").clear().type(service_name);
  cy.get("form > div:nth-child(2) > div:nth-child(1) > nz-form-item > nz-form-control > div > span > textarea")
    .clear()
    .type(description);

  cy.get(".ant-select-selection")
    .first()
    .type(category + "{enter}");
  cy.get(".ant-select-selection > .ant-select-selection__rendered")
    .last()
    .click({ force: true });
  cy.get(".cdk-overlay-backdrop").click({ force: true, multiple: true });
  cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input")
    .first()
    .clear()
    .type(price);
  cy.get(
    ".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input"
  )
    .eq(1)
    .clear()
    .type(member_price);
  cy.get(
    ".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input"
  )
    .eq(2)
    .clear()
    .type(add_on_price);
  cy.get(
    ".ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > .ant-input"
  )
    .last()
    .clear()
    .type(bonus_price);
  cy.get(".ant-form-item-control > .ant-form-item-children > .ant-input")
    .last()
    .clear()
    .type(video_link);
});

Cypress.Commands.add("Verify_service_data", (category, status) => {
  cy.readFile("service.json").then((data) => {
    
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3)").contains(
      data.service_name
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4)").contains(
      data.description
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(5)").contains(
      category
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(6)").contains(
      data.price
    );
    cy.get("table > tbody > tr:nth-child(1) >td:nth-child(8)").contains(status);
  });
});


Cypress.Commands.add("Category_form", (BU, servies) => {

  // Add Faker data
  const Cat_name = faker.name.firstName();
  const BU = BU
  const code = faker.address.zipCode();
  const service = service

  // Write data in JSON file
  cy.writeFile("category.json", {
    Cat_name: Cat_name,
    BU: BU,
    code: code,
    services: servies,
  });
  cy.get('#name').should("be.visible").clear().type(Cat_name);
  cy.get("#bu > div").should("be.visible").click();
  cy.get('.ml-2').contains(BU).click()
  cy.get("#suggestedUnit > div").should("be.visible").click();
  cy.get('.ant-select-dropdown-menu >').contains(servies).click()
})
Cypress.Commands.add("Verify_Category_data", (status) => {
  cy.readFile("category.json").then((data) => {
    cy.wait(2000)
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) >").contains(data.Cat_name);
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(4) > span > span > span > span").contains(data.services)
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(5) > span > span").contains(data.BU)
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > nz-tag").contains(status.toUpperCase())
  });
})