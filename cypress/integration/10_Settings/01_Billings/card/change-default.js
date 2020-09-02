///<reference types="Cypress"/>
const data = require('../../../../fixtures/data.json')

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
        cy.get("[data-cy='cardExpiry']").eq(0)
            .invoke('text').then((text1) => {
                console.log(text1);
                cy.get("[data-cy='listCardDefault']").eq(0).click()
                cy.get('.ant-popover-buttons > .ant-btn-primary').click()
                cy.wait(2000);
                cy.contains("Card has been successfully updated");
                cy.get("[data-cy='cardExpiry']").eq(0).invoke('text').should((text2) => {
                    expect(text1).not.to.eq(text2)
                })
            })
        cy.wait(2000);
    })

});
