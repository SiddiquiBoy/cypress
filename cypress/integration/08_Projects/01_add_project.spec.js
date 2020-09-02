///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')
import "cypress-file-upload";

describe("Add Project", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })
    
    it("As a Org Admin I should be able to navigate on Add project page ", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get("button.ml-10.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.get("section > section.title-content-container > section").contains(" Add Project ")
    });
    it("At Add Project page labels should be proper", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get("button.ml-10.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.get("section > section.title-content-container > section").contains(" Add Project ")
        cy.get(" section > section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-label > label").contains(" Name ")
        cy.get("section > section:nth-child(1) > section.ant-col.ant-col-12.ng-star-inserted > nz-form-item > nz-form-label > label").contains(" Customer ")
        cy.get("section > section > section > section:nth-child(2) > section > nz-form-item > nz-form-label > label").contains(" Status ")
        cy.get("nz-form-control > div > span > section > button").click()
        cy.get("app-project-jobs > section > section > section > button").click()
        cy.wait(1000)
        cy.get(':nth-child(1) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains(" Job Type ")
        cy.get(':nth-child(1) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Business Unit")
        cy.get(':nth-child(2) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Lead Source")
        cy.get(':nth-child(2) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("Summary")
        cy.get(':nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label > label').contains("Technicians")
        cy.get(':nth-child(3) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("Tags")
        cy.get(':nth-child(4) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Start Date")
        cy.get(':nth-child(4) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Start Time")
        cy.get(':nth-child(5) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Billing Address")
        cy.get(':nth-child(5) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Service Address")
        cy.get(':nth-child(6) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Services")
        cy.get(':nth-child(6) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Status")
        cy.get('.mr-4.ant-btn').should("be.enabled")
        cy.get(':nth-child(3) > .add-button-container > .mr-auto').should("be.enabled")
        cy.get(':nth-child(2) > .add-button-container > .mr-auto').should("be.disabled")
        cy.get('.button-container > .mr-auto').should("be.disabled")
    });
    it("At Add Project Page each field should have proper validation", () => {

        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get("button.ml-10.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.get("section > section.title-content-container > section").contains(" Add Project ")
        cy.wait(2000)
        cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input").should("be.visible").clear().type("sda12!@#").clear();
        cy.contains("Enter valid name");
        cy.get("nz-form-control > div > span > section > button").click()
        cy.get("app-project-jobs > section > section > section > button").click()
        cy.get('.titlecase').should("be.visible").clear().type("sda12!@#").clear();
        cy.contains("Enter a lead source")
    });
    
    it("As a Org Admin I should be able to add new Project with jobs ", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get("button.ml-10.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.get("section > section.title-content-container > section").contains(" Add Project ")
        cy.Project_Details_form();
        cy.get("nz-form-control > div > span > section > button").click()
        cy.get("app-project-jobs > section > section > section > button").click()
        const status = "Active"
        cy.wait(1000)
        cy.Project_Job_form(status)
        cy.get('.button-container > .mr-auto').click();
        cy.wait(500)
        cy.contains("Project has been successfully added")
        cy.wait(5000)
        // Verify data in Project details and table 
        cy.get('div > ul > li:nth-child(8) > a').click()
        cy.readFile("project_detail_form.json").then((data) => {
            //verify data in table 
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span").contains(data.project_name)
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(5) > span > span").contains(data.customer_name)
            cy.readFile("project_job_form.json").then((data) => {
                cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > nz-tag").contains(data.status.toUpperCase())
                cy.get("table > tbody > tr:nth-child(1) > td:nth-child(4) > span > span > span > span").contains(data.job_type)
            })
            //verify data in detail view 
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span:nth-child(1) > a > i").click().wait(1500)
            cy.get("section > section > section > nz-page-header > div > nz-page-header-title").contains("Project Details")
            cy.get("nz-statistic:nth-child(2) > div.ant-statistic-content > nz-statistic-number > span").contains(data.project_name)
            cy.get(" nz-statistic:nth-child(3) > div.ant-statistic-content > nz-statistic-number > a").contains(data.customer_name)
            cy.readFile("project_job_form.json").then((data) => {
        
                cy.get("table > tbody > tr > td:nth-child(1) > span > span").contains(data.job_type)
                cy.get("table > tbody > tr > td:nth-child(2) > span > span").contains("Dec 12, 2020")
                cy.get("table > tbody > tr > td:nth-child(3) > span > span").contains("1:13 pm")
                cy.get("table > tbody > tr > td:nth-child(4) > span > span").contains(data.tag)
                cy.get("table > tbody > tr > td:nth-child(5) > span > span").contains(data.summary)
                cy.get("table > tbody > tr > td:nth-child(6) > span > span").contains(data.technician)
                cy.get("table > tbody > tr > td:nth-child(7) > span > span").contains("Scheduled")
            })

        })
       
    });
    
    it("As a Org Admin I should be able to add new Project without jobs ", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get("button.ml-10.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.get("section > section.title-content-container > section").contains(" Add Project ")
        cy.Project_Details_form();
        cy.get('.mr-auto').click()
        cy.wait(1000)
        cy.get("div > span > section > button.mr-auto.ant-btn.ng-star-inserted.ant-btn-primary").should("be.visible").click()
        cy.contains("Project has been successfully added")
        cy.wait(5000)
        cy.get('div > ul > li:nth-child(8) > a').click()

        cy.readFile("project_detail_form.json").then((data) => {
            //Verify project details in table 
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span").contains(data.project_name)
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(5) > span > span").contains(data.customer_name)
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > nz-tag").contains("ACTIVE")
            //Verify project details in detail view
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span:nth-child(1) > a > i").click().wait(1500)
            cy.get("section > section > section > nz-page-header > div > nz-page-header-title").contains("Project Details")
            cy.get("nz-statistic:nth-child(2) > div.ant-statistic-content > nz-statistic-number > span").contains(data.project_name)
            cy.get(" nz-statistic:nth-child(3) > div.ant-statistic-content > nz-statistic-number > a").contains(data.customer_name)
            cy.get("section > nz-page-header > div > nz-page-header-tags > nz-tag").contains("ACTIVE")
        })
    });
});