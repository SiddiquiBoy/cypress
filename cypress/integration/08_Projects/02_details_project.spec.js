///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')
import "cypress-file-upload";
import faker from "faker";

describe("Project Detail", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })
    
    it("As a Org Admin I should be able navigate to project details page", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get(':nth-child(1) > :nth-child(7) > :nth-child(1) > :nth-child(1) > a > .anticon > svg').click()
        cy.get('.ant-page-header-heading-title').contains("Project Details")
    });
    it("Verify the labels on Prject detail page", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get(':nth-child(1) > :nth-child(7) > :nth-child(1) > :nth-child(1) > a > .anticon > svg').click()
        cy.get('.ant-page-header-heading-title').contains("Project Details")
        cy.get("nz-page-header-content > nz-row > nz-statistic:nth-child(1) > div.ant-statistic-title > span").contains("CODE")
        cy.get("nz-page-header-content > nz-row > nz-statistic:nth-child(2) > div.ant-statistic-title > span").contains("NAME")
        cy.get("nz-page-header-content > nz-row > nz-statistic:nth-child(3) > div.ant-statistic-title > span").contains("CUSTOMER")
        cy.get("nz-page-header-content > nz-row > nz-statistic:nth-child(4) > div.ant-statistic-title > span").contains("CREATED DATE")
        cy.get("section > section > section > h5").contains("Job")
        cy.get("div > section > section.buttons-container.ng-star-inserted > button").should("be.visible")
    });
    
   
    it("As a Org Admin I should be able to update the Project details", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get(':nth-child(2) > :nth-child(7) > :nth-child(1) > :nth-child(1) > a > .anticon > svg').click()
        cy.get('.ant-page-header-heading-title').contains("Project Details")
        cy.get("section > section > nz-page-header > div > nz-page-header-tags > i").click()
        const project_name1 = titleCase(faker.name.lastName()) + " Project";
        cy.wait(1000)
        cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input").clear()
        cy.contains("Enter valid name")
        cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input").clear().type(project_name1)
        cy.get('.text-right > .ant-btn').click().wait(450)
        cy.contains("Project detail has been successfully updated")
        cy.wait(2000)
        cy.get("nz-statistic:nth-child(2) > div.ant-statistic-content > nz-statistic-number > span").contains(project_name1)
    })
    
    it("As a Org Admin I should be able to Add the job respective to the Project", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get(':nth-child(2) > :nth-child(7) > :nth-child(1) > :nth-child(1) > a > .anticon > svg').click()
        cy.get('.ant-page-header-heading-title').contains("Project Details")
        //Verify the labels on add job popup
        cy.get("div > section > section.buttons-container.ng-star-inserted > button").click().wait(5000)
        cy.get(':nth-child(1) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Job Type")
        cy.get(':nth-child(1) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Business Unit")
        cy.get(':nth-child(2) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Lead Source")
        cy.get(':nth-child(2) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("Summary")
        cy.get(':nth-child(3) > :nth-child(1) > .ant-form-item > .ant-form-item-label > label').contains("Technician")
        cy.get(':nth-child(3) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("Tags")
        cy.get(':nth-child(4) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Start Date")
        cy.get(':nth-child(4) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Start Time")
        cy.get(':nth-child(5) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Customer")
        cy.get(':nth-child(5) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Project")
        cy.get(':nth-child(6) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Billing Address")
        cy.get(':nth-child(6) > :nth-child(2) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Service Address")
        cy.get(':nth-child(7) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Services")
        cy.get(':nth-child(7) > :nth-child(2) > .ant-form-item > .ant-form-item-label > label').contains("Status")

        // add job via popup
        const job_type = "Jazmin";
        const business_unit = "Jackson"
        const lead_source = titleCase(faker.lorem.words())
        const summary = faker.lorem.paragraph()
        const technician = "Brandy Hoppe"
        const tag = "Tag1"
        const date = "12/12/2020"
        const time = "13:13:13"
        const customer = "Ernest Macgyver"
        const project = "Klocko"
        const services = "Practical Steel Chair"

        cy.writeFile("job_under_project.json", {
            job_type: job_type,
            business_unit: business_unit,
            lead_source: lead_source,
            summary: summary,
            technician: technician,
            tag: tag,
            date: date,
            time: time,
            services: services,
            customer: customer,
            project: project,

        });
        cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div").click()
        cy.get('.ant-select-dropdown-menu >').contains(job_type).click()
        cy.get("section:nth-child(1) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div").click()
        cy.get('.ant-select-dropdown-menu >').contains(business_unit).click()
        cy.get("section:nth-child(2) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input").clear().type(lead_source)
        cy.get(" section:nth-child(2) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > textarea").clear().type(summary)
        cy.get("section:nth-child(3) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div").click()
        cy.get('.ant-select-dropdown-menu >').contains(technician).click()
        cy.get("body > div > div.cdk-overlay-backdrop.nz-overlay-transparent-backdrop.cdk-overlay-backdrop-showing").click()
        cy.get("section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div").click()
        cy.get('.ant-select-dropdown-menu >').contains(tag).click()
        cy.get("body > div > div.cdk-overlay-backdrop.nz-overlay-transparent-backdrop.cdk-overlay-backdrop-showing").click({ force: true })
        cy.get("section:nth-child(4) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-date-picker > nz-picker > span").click();
        cy.get('.ant-calendar-input-wrap').type(date).type('{enter}')
        cy.wait(2000)
        cy.get('.ant-time-picker-input').click()
        cy.get('.ant-time-picker-panel-input-wrap').type(time)
        cy.get('.cdk-overlay-backdrop').click({ force: true })
        cy.get("section:nth-child(6) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
        cy.get('.ant-select-dropdown-menu-item').click()
        cy.wait(1000)
        cy.get("body > div > div.cdk-overlay-backdrop.nz-overlay-transparent-backdrop.cdk-overlay-backdrop-showing").click()
        cy.get("section:nth-child(6) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
        cy.get('.ant-select-dropdown-menu-item').click()
        cy.get("body > div > div.cdk-overlay-backdrop.nz-overlay-transparent-backdrop.cdk-overlay-backdrop-showing").click()
        cy.get("section:nth-child(7) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
        cy.get('.ant-select-dropdown-menu >').contains(services).click()
        cy.get('form > section > section > nz-form-item > nz-form-control > div > span > button').should("be.enabled")
        cy.get('.cdk-overlay-backdrop').click({ force: true })
        cy.get('.mr-auto').click()
        cy.wait(450)
        cy.contains("Job has been successfully added")
        cy.wait(3000)
        cy.get('.ant-page-header-heading-title').contains("Project Details")
        // verify data in table 
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span").contains("Dec 12, 2020")
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(3) > span > span").contains("1:13 pm").wait(250)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(4) > span > span").contains(" Tag1")
        //cy.get("table > tbody > tr:nth-child(1) > td:nth-child(5) > span > span").contains(data.summary)
        //cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span").contains(data.technician)

    })

    it("As a Org Admin I should be able to search and filter the job by calendar and search bar", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get(':nth-child(2) > :nth-child(7) > :nth-child(1) > :nth-child(1) > a > .anticon > svg').click()
        cy.get('.ant-page-header-heading-title').contains("Project Details")
        cy.wait(2000)
        cy.readFile("job_under_project.json").then((data) => {
            cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().type("dadada")
            cy.get("div.ant-table-placeholder.ng-star-inserted > nz-embed-empty > nz-empty > p").contains(" No Data ")
            cy.wait(2000)
            cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().wait(2000).type(data.job_type)
            cy.wait(3000)
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(1) > span > span").contains(data.job_type)
            cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().wait(2000)
            cy.get("section.date-filter-container.ng-star-inserted > nz-date-picker > nz-picker > span > input").click()
            // cy.get("table > tbody > tr:nth-child(3) > td:nth-child(7) > div").click()
            cy.get("date-range-popup > div > div > div > calendar-input > div").type(data.date).type('{enter}')
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span").contains("Dec 12, 2020")
            cy.get("section.date-filter-container.ng-star-inserted > nz-date-picker > nz-picker > span > input").click()
            cy.get("date-table > table > tbody > tr:nth-child(5) > td:nth-child(4)").click().wait(2000)
            cy.get("div.ant-table-placeholder.ng-star-inserted > nz-embed-empty > nz-empty > p").contains(" No Data ")
        })
    })

    it("As a Org Admin I should be able filter job by the status", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get(':nth-child(2) > :nth-child(7) > :nth-child(1) > :nth-child(1) > a > .anticon > svg').click()
        cy.get('.ant-page-header-heading-title').contains("Project Details")
        cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click().wait(1000)
        cy.get("div > div > ul > li:nth-child(1) > span").click();
        cy.get("div > div > ul > li:nth-child(3) > span").click();
        cy.get("div > div > div > a.ant-table-filter-dropdown-link.confirm > span").click()
        cy.get("div.ant-table-placeholder.ng-star-inserted > nz-embed-empty > nz-empty > p").contains(" No Data ")
        cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click().wait(1000)
        cy.get("div > div > div > a.ant-table-filter-dropdown-link.clear > span").click()
    })
});

function titleCase(text) {
    let sentence = text.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(' ');
}