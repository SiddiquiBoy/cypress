///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')
import "cypress-file-upload";

describe("Add Job", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })
    
    it("As a Org Admin I should be able to navigate on Add job page", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get('.ml-10').should('be.visible').click()
        cy.wait(2000)
        cy.contains("Add Job")
    })
    it("At Job page each page should have proper labels ", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get('.ml-10').should('be.visible').click()
        cy.wait(2000)
        cy.contains("Add Job")
        cy.get(':nth-child(1) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains(" Job Type ")
        cy.get(':nth-child(1) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Business Unit")
        cy.get(':nth-child(2) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Lead Source")
        cy.get(':nth-child(2) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("Summary")
        cy.get(':nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label > label').contains("Technicians")
        cy.get(':nth-child(3) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("Tags")
        cy.get(':nth-child(4) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Start Date")
        cy.get(':nth-child(4) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Start Time")
        cy.get(':nth-child(5) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Customer")
        cy.get(":nth-child(5) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required").contains("Project")
        cy.get(":nth-child(6) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required").contains("Billing Address")
        cy.get(':nth-child(6) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Service Address")
        cy.get(':nth-child(7) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Services")
        cy.get('section:nth-child(7) > section:nth-child(2) > nz-form-item > nz-form-label > label').contains("Status")
        cy.get('nz-form-control > div > span > button').should("be.disabled")
    })
    
    it("At Add Job page each page should have proper validation", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get('.ml-10').should('be.visible').click()
        cy.wait(2000)
        cy.contains("Add Job")
        cy.get('.titlecase').should("be.visible").clear().type("sda12!@#").clear();
        cy.contains("Enter a lead source")
    })
        
    it("As a Org Admin I should be able to add job successfully", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(3000)
        cy.get('.title-container').contains("Jobs")
        cy.get('.ml-10').should('be.visible').click().wait(2000)
        cy.contains("Add Job")
        cy.job_form()
        cy.get('form > section > section > nz-form-item > nz-form-control > div > span > button').click()
        cy.wait(200)
        cy.contains("Job has been successfully added")
       // cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(3000)
        status="Scheduled"
        cy.verify_job_data(status)
    })
});