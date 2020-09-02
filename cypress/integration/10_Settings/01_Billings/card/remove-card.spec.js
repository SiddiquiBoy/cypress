///<reference types="Cypress"/>
const data = require('../../../../fixtures/data.json')

let numberOfCards = 0;
describe('', function () {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })
   
    it("As a Org Admin I should be able to remove card from list card page", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Settings"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Cards")
        cy.get("[data-cy='addCard']").should('be.visible')
        cy.wait(2000)
        cy.url().should('have.string', '/settings/billings/card');
        cy.get('.cc-container').find("[data-cy='listCardRemove']").then(listing => {
            numberOfCards = Cypress.$(listing).length;
            cy.get("[data-cy='listCardRemove']").eq(0).click()
            cy.get('.ant-popover-buttons > .ant-btn-primary').click()
            cy.wait(2000);
            cy.get("[data-cy='listCardRemove']").should('have.length', numberOfCards - 1)
            cy.contains("Card has been successfully deleted");
        });
    })

});
