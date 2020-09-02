import faker from "faker";
import { data } from "cypress/types/jquery";

// Fill customer form with faker data 
Cypress.Commands.add("Customer_form1", (Bu) => {

    // Add Faker data for input fields
    const fname = titleCase(faker.name.firstName());
    const lname = titleCase(faker.name.lastName());
    const office_phone = faker.phone
        .phoneNumberFormat()
        .replace(/[^\d]/g, "")
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    const home_phone = faker.phone
        .phoneNumberFormat()
        .replace(/[^\d]/g, "")
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    const email = faker.internet.email().toLowerCase();
    const Bu = Bu;
    const Country = "United States";
    const latitude = faker.address.latitude();
    const longitude = faker.address.longitude();

    // Write data in JSON file
    cy.writeFile("customer1.json", {
        fname: fname,
        lname: lname,
        office_phone: office_phone,
        home_phone: home_phone,
        email: email,
        Bu: Bu,
        Country: Country,
        latitude: latitude,
        longitude: longitude,
    });

    //fill faker data into the fields 
    //-> Details section
    cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
        .should("be.visible")
        .clear()
        .type(fname)

    cy.get("section:nth-child(1) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
        .should("be.visible")
        .clear()
        .type(lname)

    cy.get("[name=homePhone]")
        .should("be.visible")
        .clear()
        .type(home_phone)

    cy.get("[name=officePhone]")
        .should("be.visible")
        .clear()
        .type(office_phone)

    cy.get("[name=email]")
        .should("be.visible")
        .clear()
        .type(email)

    cy.get("section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div").click()
    cy.get('.ant-select-dropdown-menu >').contains(Bu).click()
    cy.get("div > span > section > nz-switch > button").click() //notification ON
    cy.get('.mr-auto').click()


});
Cypress.Commands.add("Customer_form2", () => {

    // faker data for form 2
    const state = faker.address.state();
    const city = faker.address.city();
    const street = faker.address.streetName();
    const landmark = "Near " + faker.address.streetAddress();
    const zip_code = faker.address.zipCode();
    const project_name = faker.name.lastName(); +" Project";
    const Pro_Code = faker.address.zipCode()

    cy.writeFile("customer2.json", {
        state: state,
        city: city,
        street: street,
        landmark: landmark,
        zip_code: zip_code,
        project_name: project_name,
        Pro_Code: Pro_Code,
    });

    //-> Address Section
    cy.wait(2000)
    cy.get('section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div').click()
    cy.get('.ant-select-dropdown-menu-item').click({ force: true })

    cy.get('section > section.ant-col.ant-col-16 > section:nth-child(1) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div').click({ force: true })
    cy.get('.ant-select-dropdown-menu >').contains(state).click({ force: true })

    cy.get('#addCity0')
        .should("be.visible")
        .clear()
        .type(city)

    cy.get("section:nth-child(2) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
        .should("be.visible")
        .clear()
        .type(street)

    cy.get("section > section.ant-col.ant-col-16 > section:nth-child(3) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
        .should("be.visible")
        .clear()
        .type(landmark)

    cy.get("section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
        .should("be.visible")
        .clear()
        .type(zip_code)

    cy.get('.button-container > .mr-auto').click()

    //-> Project Section
    cy.get("form > section.step-content-container > app-customer-projects > section > section > section > button").click({ force: true })
    cy.wait(2000)
    cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
        .should("be.visible")
        .clear()
        .type(project_name)
    
    //cy.get("div > span > section > button.mr-auto.ant-btn.ng-star-inserted.ant-btn-primary").click()
    cy.wait(1000)
});

// Verify Customer Data
Cypress.Commands.add("Verify_Customer_data", (status) => {
    cy.readFile("customer1.json").then((data) => {
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span").contains(data.fname + " " + data.lname);
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(4) > span > span").contains(data.office_phone);
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(5) > span").contains(data.email);
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > nz-tag").contains(status.toUpperCase());
    })
    cy.readFile("customer2.json").then((data) => {
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(3) > span > span").contains(data.street);
    })
});

function titleCase(text) {
	let sentence = text.toLowerCase().split(' ');
  for(let i = 0; i< sentence.length; i++) {
  	sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence.join(' ');
}