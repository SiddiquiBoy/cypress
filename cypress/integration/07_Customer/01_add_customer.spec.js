///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')
import "cypress-file-upload";

describe("Add Customer", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })
    //IT - Navigate to the Customer page
    it("As a Org Admin I should be able to navigate on Customers page", () => {

        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
    })
  
    //IT- Verify the labels 
    it("At Add Customer page each field should have proper labels ", () => {

        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get('.ml-10').click()
        cy.get('.title-container').contains("Add Customer")
        cy.get('.ant-steps-item-active > .ant-steps-item-container').should("be.visible")
        cy.get('[nztitle="Addresses"] > .ant-steps-item-container').should("be.visible")
        cy.get('[nztitle="Projects"] > .ant-steps-item-container').should("be.visible")

        cy.get('.ant-steps-item-active > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title').contains("Details")
        cy.get('[nztitle="Addresses"] > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title').contains("Addresses")
        cy.get('[nztitle="Projects"] > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title').contains("Projects")
        cy.get(':nth-child(1) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("First Name")
        cy.get(':nth-child(1) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Last Name")
        cy.get(':nth-child(2) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Home Phone")
        cy.get(':nth-child(2) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Office Phone")
        cy.get(':nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Email")
        cy.get(':nth-child(3) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Business Unit")
        cy.get('[nzspan="12"] > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Status")
        cy.get('.switch-label').contains("Job Notification")
        cy.get('.ant-upload-text').contains("Upload Customer Image")
        cy.get('.mr-auto').click()

        cy.get(':nth-child(1) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Country")
        cy.get(':nth-child(1) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("State")
        cy.get(':nth-child(2) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("City")
        cy.get(':nth-child(2) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Street")
        cy.get(':nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label > label').contains("Landmark")
        cy.get(':nth-child(3) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Zip Code")
        cy.get(':nth-child(4) > :nth-child(1) > .ant-form-item > .ant-form-item-label > label').contains("Latitude")
        cy.get(':nth-child(4) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("Longitude")

        cy.get('.mr-4.ant-btn').should("be.visible").and("be.enabled")
        cy.get('.add-button-container > .mr-auto').should("be.disabled")
        cy.get('.button-container > .mr-auto').click()
        cy.get('.add-button-container > .mr-auto').click()

        cy.get(':nth-child(1) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Name")
        cy.get('section > section.ant-col.ant-col-16 > section:nth-child(1) > section.ant-col.ant-col-12.ng-star-inserted > nz-form-item > nz-form-label > label').contains("Status")

    })

    //IT - Verify the validation
    it("At Add Customer page each field should have proper validation", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get('.ml-10').click()
        cy.get('.title-container').contains("Add Customer")
        cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("save")
            .clear()
        cy.contains("Enter valid first name")
        cy.get("section:nth-child(1) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("save")
            .clear()
        cy.contains("Enter valid last name")

        cy.get("[name=homePhone]")
            .should("be.visible")
            .clear()
            .type("12345")
            .clear()
        cy.contains("Enter a valid Phone Number")

        cy.get("[name=officePhone]")
            .should("be.visible")
            .clear()
            .type("456123")
            .clear()
        cy.contains("Enter valid phone number")

        cy.get("[name=email]")
            .should("be.visible")
            .clear()
            .type("save")
            .clear()
        cy.contains("Enter valid email")
        cy.get('.mr-auto').click()
        cy.wait(1000)
        cy.get('#addCity0')
            .should("be.visible")
            .clear()
            .type("save")
            .clear()
        cy.contains("Enter a valid City")
        cy.get("section:nth-child(2) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("save")
            .clear()
        cy.contains("Enter a street")

        cy.get("section > section.ant-col.ant-col-16 > section:nth-child(3) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("save")
            .clear() //this is for landmark 

        cy.get("section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("4561")
            .clear()
        cy.contains("Enter a valid zipcode")

        cy.get("section:nth-child(4) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("save")
        cy.contains("Enter a valid latitude")

        cy.get("section:nth-child(4) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("save")
        cy.contains("Enter a valid longitude")
        cy.get('.button-container > .mr-auto').click()

        cy.get("form > section.step-content-container > app-customer-projects > section > section > section > button").click({ force: true })
        cy.wait(2000)
        cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("save")
            .clear()
        cy.contains("Enter a name")

        cy.get("form > section.form-button-container-row.ant-row > section > nz-form-item > nz-form-control > div > span > section > button.mr-4.ant-btn.ng-star-inserted.ant-btn-primary").click().wait(1000).click().wait(1000)

        cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("s#$%sve")
        cy.contains("Enter valid first name")
        cy.get("section:nth-child(1) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("@#$%s")
        cy.contains("Enter valid last name")
        cy.get("[name=homePhone]")
            .should("be.visible")
            .clear()
            .type("SA#$5s")
        cy.contains("Enter a valid Phone Number")
        cy.get("[name=officePhone]")
            .should("be.visible")
            .clear()
            .type("@#sad")
        cy.contains("Enter valid phone number")
        cy.get("[name=email]")
            .should("be.visible")
            .clear()
            .type("s@ca@v.se")
        cy.contains("Enter valid email")
        cy.get('.mr-auto').click()
        cy.wait(1000)
        cy.get("section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("fg!@#")
            .clear()
        cy.contains("Enter a valid zipcode")
        cy.get("section:nth-child(4) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("sa@#e")
        cy.contains("Enter a valid latitude")
        cy.get("section:nth-child(4) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("sa@@3ve")
        cy.contains("Enter a valid longitude")

    })

    //IT - add new customer with project 
    it("As a Org Admin I should be able to add new Customer with Project", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get('.ml-10').click()
        cy.get('.title-container').contains("Add Customer")
        const Bu = "Zola";
        // const Bu = "Armand";
        const status = "Active";
        cy.Customer_form1(Bu);
        cy.Customer_form2();
        cy.get('.button-container > .mr-auto').click()
        cy.wait(600)
        cy.contains("Customer has been successfully added")
        cy.Verify_Customer_data(status);
    })
    
    //IT - verify the Cancel button Functionlity
    it("At add Customer page verify the Cancel Button functionality", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get('.ml-10').click()
        cy.get('.title-container').contains("Add Customer")
        cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input")
            .should("be.visible")
            .clear()
            .type("demo");
        cy.get('.link').click() // click on cancel button
        cy.wait(1000)
        cy.get('.ant-modal-body').should('be.visible').contains("Changes will not be saved. Do you wish to proceed?") // verify the visibility of confirmation modal
        cy.wait(1000)
        //cy.get('.ant-btn-default').click() // click on No button in confirmation modal
        cy.get('.ant-modal-footer > .ant-btn-primary').click()
        cy.wait(1000)
        cy.get('.title-container').contains(" Customers ")
    })


    //IT- upload image 
    it("As a Org Admin I should be able to upload profile image of an Customer", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span:nth-child(2) > a > i").click()
        cy.get("div > section.page-header-container > app-page-header > section > section.title-content-container > section").contains(" Edit Customer ")

        const imagePath = data.image_path;
        // cy.get('.ant-upload-drag > .ant-upload').click();
        cy.wait(1500);
        cy.get('.ant-upload-drag > .ant-upload').attachFile(imagePath, { subjectType: "drag-n-drop", });
        var i = 0;
        for (i = 0; i < 3; i++) {
            cy.wait(20000);
        }
        cy.get("form > section.form-button-container-row.ant-row > section > nz-form-item > nz-form-control > div > span > section > button").click();
        cy.wait(2000)
        cy.get("div > span > section > button.mr-auto.ant-btn.ng-star-inserted.ant-btn-primary").click();
        cy.wait(2000)
        cy.get("nz-form-control > div > span > section > button.mr-auto.ant-btn.ng-star-inserted.ant-btn-primary").click();
        cy.wait(800);
        cy.contains("Customer has been successfully updated");
        cy.wait(500);
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span:nth-child(2) > a > i").click()
        cy.get("div > section.page-header-container > app-page-header > section > section.title-content-container > section").contains(" Edit Customer ")
        cy.wait(1000)
        cy.get("section > app-file-upload > nz-spin > div > nz-upload > nz-upload-list > div > div > span > span").should("be.visible")
    })
    
});