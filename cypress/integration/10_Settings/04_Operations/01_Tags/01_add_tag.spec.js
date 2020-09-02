///<reference types="Cypress"/>
const data = require('../../../../fixtures/data.json')
import "cypress-file-upload";


describe("Add Tags", () => {

    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    it("As a Org Admin I should be able to navigate on tag page ", () => {

    });

    it("Each Field should have proper labels", () => {

    });

    it("Each field should have proper validation", () => {

    });

    it("As a org Admin I should be able to add new tag", () => {

    });
    
    it("Verify the Cancel Functionality",() =>{

    });

});