///<reference types="Cypress"/>
const data = require('../../../../fixtures/data.json')
import "cypress-file-upload";

describe("Edit Tags", () => {

    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    it("As A Org Admin I should be able to navigate On Edit Tag Page",() =>{

    });

    it("As A Org Admin I should be able to edit Tag",() =>{

    });

});