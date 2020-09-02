import faker from "faker";

Cypress.Commands.add("Company_form", () => {

  // Add Faker data for input fields
  const company_name = faker.name.firstName()
  const street = faker.address.streetAddress()
  const city = faker.address.city()
  const zipcode = faker.address.zipCode().substring(0,5);
  const p1=faker.phone.phoneNumber()
  const p2 = p1.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  const phone1=p2.substring(0, 14);
  const state = faker.address.state();

  // Write data in JSON file
  cy.writeFile("company.json", {
    company_name: company_name,
    street: street,
    city: city,
    zipcode: zipcode,
    phone: phone1,
    state: state,
  });

  // update the company details 
  cy.get('#name').should('be.visible').clear().type(company_name)
  cy.get('#address').should('be.visible').clear().type(street)
  cy.get('form > div:nth-child(3) > div:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div').click();
  cy.get('.ant-select-dropdown-menu >').contains(state).click()
  cy.get('#city').should('be.visible').clear().type(city)
  cy.get('#zipcode').should('be.visible').clear({force:true}).type(zipcode)
  cy.get('#contact').should('be.visible').clear({force:true}).wait(600).type(phone1)
  cy.get('nz-form-control > div > span > button').should('be.visible').should('be.enabled').click()
  cy.waitUntil(() => cy.contains('Company Profile has been successfully updated'))
  cy.wait(2000)
});

Cypress.Commands.add("Verify_comp_data", () => {
  cy.readFile("company.json").then((data) => {
    cy.get('#name').should('have.value', data.company_name)
    cy.get('#address').should('have.value', data.street)
    cy.get('#city').should('have.value', data.city)
    cy.wait(600)
    cy.get('#zipcode').should('have.value', data.zipcode)
    cy.wait(600)
    cy.get('#contact').should('have.value', data.phone)
  });
});
