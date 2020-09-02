///<reference types="Cypress"/>
import "cypress-file-upload";
const data = require("../../../fixtures/data.json");

// An Organization Admin can see listing of Estimates Successfully
describe("List Estimates", function () {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    //IT- Navigate to Estimate Listing page 
    it("As A Org Admin I should be able to navigate on Estimate detail page", () => {
        cy.get('[ng-reflect-nz-title="Follow Up"] > a').click();
        cy.wait(2000);
        cy.get(".sidebar-menu-list > :nth-child(1) > .ant-menu-item > a").click();
        cy.wait(2000);
        cy.get(".title-container").contains("Estimates");
    })

})
