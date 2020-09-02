///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')
import faker from "faker";

describe("Edit Customer", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    //IT- navigate to the Customer page 
    it("As a Org Admin i should be able to navigate on Customer page", () => {
    
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")

    })
    //IT- Edit Customer 
    it("As a Org Admin I should be able to edit Customer details", () => {
        
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")

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
        const Bu = "Tre";
        //const Bu = "Willie";
        const status = "Inactive";

        // Write data in JSON file
        cy.writeFile("edit_customer.json", {
            fname: fname,
            lname: lname,
            office_phone: office_phone,
            home_phone: home_phone,
            email: email,
            Bu: Bu,
            status: status,
        });

        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span:nth-child(2) > a > i").click();
        cy.wait(2000)
        cy.get("section > nz-spin > div > section.page-header-container > app-page-header > section > section.title-content-container > section").contains(" Edit Customer ")
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
        cy.get("section.ant-col.ant-col-16 > section:nth-child(4) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div").click()
        cy.get('.ant-select-dropdown-menu >').contains(status).click()
        cy.get("form > section.form-button-container-row.ant-row > section > nz-form-item > nz-form-control > div > span > section > button").click()
        cy.wait(1000)
        cy.get("form > section.form-button-container-row.ant-row > section > nz-form-item > nz-form-control > div > span > section > button.mr-auto.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.wait(1000)
        cy.get("form > section.form-button-container-row.ant-row > section > nz-form-item > nz-form-control > div > span > section > button.mr-auto.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.wait(200)
        cy.contains("Customer has been successfully updated")

        cy.readFile("edit_customer.json").then((data) => {
            cy.get("table > tbody > tr:nth-child(2) > td:nth-child(2) > span > span").contains(data.fname + " " + data.lname);
            cy.get("table > tbody > tr:nth-child(2) > td:nth-child(4) > span > span").contains(data.office_phone);
            cy.get("table > tbody > tr:nth-child(2) > td:nth-child(5) > span").contains(data.email);
            cy.get("table > tbody > tr:nth-child(2) > td:nth-child(6) > span > span > nz-tag").contains(status.toUpperCase());
        })

    })

});