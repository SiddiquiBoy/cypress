///<reference types="Cypress"/>
const data = require('../../../../fixtures/data.json')

// const { TitleCasePipe } = require('@angular/common');
let numberOfCards = 0;
describe('', function () {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })
   
    it("As a Org Admin I should be able to navigate on list card page", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Settings"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Cards")
        cy.get("[data-cy='addCard']").should('be.visible')
        cy.wait(2000)
        cy.url().should('have.string', '/settings/billings/card');
        cy.get("[data-cy='addCard']").click()
        cy.wait(2000)
        cy.fillAddCardForm();
        cy.wait(2000)

    })

});
