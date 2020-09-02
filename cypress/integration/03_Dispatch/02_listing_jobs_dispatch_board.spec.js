///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')
import "cypress-file-upload";

describe("Job Listing", () => {

    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })

    afterEach("Logout", () => {
        cy.logout()
    })

    it("As a Org Admin I should be able to navigate on Dispatch Board page",() =>{
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Dispatch Board"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Dispatch Board")
    });

    it("As an Org Admin I should be able to search job using search bar", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Dispatch Board"] > a').click()
        cy.wait(2000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Dispatch Board ")
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().type("Caesar")
        cy.wait(4000)
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().wait(3000).type("Project1").wait(4000)
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().wait(3000)
    })

    it("As an org Admin I should be able to filter the job", () =>{
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Dispatch Board"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Dispatch Board")
        //filter by status 
        cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click()
        cy.get("div > ul > li:nth-child(1) > span").click()
        cy.get("div > div > a.ant-table-filter-dropdown-link.confirm > span").click()
    })
})