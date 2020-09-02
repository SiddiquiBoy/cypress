///<reference types="Cypress"/>
import "cypress-file-upload";
const data = require("../../fixtures/data.json");

describe("Add Dispatch Board Event", () => {

    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    it("As a Org Admin I should be able to navigate on Dispatch Board page", () => {

        cy.wait(1000)
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Dispatch Board"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Dispatch Board ")
    })

    it("As an Org Admin I can add an event successfully ", () => {

        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Dispatch Board"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Dispatch Board ")
        cy.get('#addEvent').click()
        cy.get('.ant-modal-title > div.ng-star-inserted').contains("Add an Event")
        cy.Add_Dispatch_Board_Event_Form();
        cy.get('form > nz-form-item > nz-form-control > div > span > button').click()
        cy.wait(200)
        cy.contains("Event has been successfully added");
        cy.wait(3000)
    })

})