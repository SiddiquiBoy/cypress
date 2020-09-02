///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')
import "cypress-file-upload";

describe("Edit Job", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    it("As a Org Admin I should be able to navigate on edit job page", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
    })

    it("As a Org Admin I should be able to edit job successfully", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(9) > span > span:nth-child(2) > a > i").click()
        cy.wait(2000)
        cy.get("section:nth-child(3) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
        cy.get('.ant-select-dropdown-menu > ').contains("Brandy Hoppe").click()
        cy.get("form > section > section > nz-form-item > nz-form-control > div > span > button").click().wait(150)
        cy.contains("Job has been successfully updated")
    })

});