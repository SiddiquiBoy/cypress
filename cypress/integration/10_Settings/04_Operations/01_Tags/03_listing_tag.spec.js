///<reference types="Cypress"/>
const data = require('../../../../fixtures/data.json')
import "cypress-file-upload";

describe("listing Tags", () => {

    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    it("As A Org Admin I should be able to navigate to on tags listing page",() =>{

    });

    it("As A Org Admin I should be able to search tag by search bar ",() =>{

    });

    it("As A Org Admin I should be able to change the status of tags as Active or Inactive",() =>{

    });

});