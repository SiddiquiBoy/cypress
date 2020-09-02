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
    it("As a Org Admin I should be able to navigate on job listing page",() =>{
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
    });
    it("As a Org Admin I should be able to search job using search bar",() =>{
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().type("Caesar")
        cy.wait(4000)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(1) > span > span").contains("Caesar")
        cy.wait(2000)
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().wait(3000).type("Project1").wait(4000)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span").contains(" Project1")
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().wait(3000)
        //search by calendar 
        cy.get("section.date-filter-container.ng-star-inserted > nz-date-picker > nz-picker > span > input").click()
        cy.get("div > div > div > calendar-input > div > div > input").clear().type("08/15/2020")
        cy.get('.cdk-overlay-backdrop').click({ force: true })
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2)").contains(" Aug 15, 2020 ")

    });

    it("As a org Admin I should be able to filter the job", () =>{
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        //filter by status 
        cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click()
        cy.get("div > ul > li:nth-child(1) > span").click()
        cy.get("div > div > a.ant-table-filter-dropdown-link.confirm > span").click()
    })
});