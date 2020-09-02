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
    it("As A Org Admin I should be able to navigate on Estimate listing page", () => {
        cy.get('[ng-reflect-nz-title="Follow Up"] > a').click();
        cy.wait(2000);
        cy.get(".sidebar-menu-list > :nth-child(1) > .ant-menu-item > a").click();
        cy.wait(2000);
        cy.get(".title-container").contains("Estimates");
    })

    it("As a Org admin I should be able to search Estimate via search bar", () => {
        
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Follow Up"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Estimates ")
        cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().type('1000')
        cy.wait(2000)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span").contains('1000')
        cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear()
        cy.wait(2000)
    })

    it("As a org Admin I should be able to filter the estimate", () =>{
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Follow Up"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Estimates ")
        //filter by status 
        cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click()
        cy.get("div > ul > li:nth-child(1) > span").click()
        cy.get("div > div > a.ant-table-filter-dropdown-link.confirm > span").click()
    })

})
