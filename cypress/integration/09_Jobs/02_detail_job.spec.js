///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')
import "cypress-file-upload";
import faker from "faker";
import { time } from "console";

describe("Job Details", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
         cy.logout()
    })
    it("As a Org Admin I should be able to navigate on job Details page ", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get(" table > tbody > tr:nth-child(2) > td:nth-child(9) > span > span:nth-child(1) > a > i").click({force:true})
        cy.get("section > section.ant-col.ant-col-24 > section > nz-page-header > div > nz-page-header-title").contains("Job Details")
    })
    it("At job Details page varify the each labels", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get(" table > tbody > tr:nth-child(2) > td:nth-child(9) > span > span:nth-child(1) > a > i").click({ force: true })
        cy.get("section > section.ant-col.ant-col-24 > section > nz-page-header > div > nz-page-header-title").contains("Job Details")
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(1) > div.ant-statistic-title > span").contains("STARTS AT")
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(2) > div.ant-statistic-title > span").contains("JOB TYPE")
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(3) > div.ant-statistic-title > span").contains("LEAD SOURCE")
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(4) > div.ant-statistic-title > span").contains("BUSINESS UNIT")
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(5) > div.ant-statistic-title > span").contains("PROJECT")
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(6) > div.ant-statistic-title > span").contains("CUSTOMER")
        cy.get("nz-page-header-content:nth-child(3) > nz-row > nz-statistic:nth-child(1) > div.ant-statistic-title").contains("Service Location")
        cy.get("nz-page-header-content:nth-child(3) > nz-row > nz-statistic:nth-child(2) > div.ant-statistic-title").contains("Bill To")
        cy.get("nz-page-header-content:nth-child(3) > nz-row > nz-statistic:nth-child(3) > div.ant-statistic-title").contains("Services")
        cy.get("nz-page-header-content:nth-child(3) > nz-row > nz-statistic:nth-child(4) > div.ant-statistic-title").contains("Technicians")
        cy.get("nz-page-header-content:nth-child(4) > nz-row > nz-statistic > div.ant-statistic-title").contains("Summary")
        cy.get("section.notes-section-title-block > span > span").contains("Notes")
        cy.wait(5000)
    })

    it("As a org Admin I should be able to Add Notes ", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get(" table > tbody > tr:nth-child(2) > td:nth-child(9) > span > span:nth-child(1) > a > i").click({ force: true })
        cy.get("section > section.ant-col.ant-col-24 > section > nz-page-header > div > nz-page-header-title").contains("Job Details")
        cy.get(" nz-page-header-content.job-notes.ant-page-header-content.ng-star-inserted > div > section.notes-section-title-block > span > i").click().wait(250)
        cy.get('.ant-modal-title > .ng-star-inserted').contains("Add a Note")
        cy.get("div > div.ant-modal-footer.ng-star-inserted > button.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.contains("Enter job note")
        const notes = faker.lorem.sentence()
        cy.get("#jobNote").clear().type(notes)
        cy.get("div > div.ant-modal-footer.ng-star-inserted > button.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.contains("Job note has been successfully added")
        cy.get("nz-page-header-content.job-notes.ant-page-header-content.ng-star-inserted > div > div > div > nz-card > div.ant-card-body > p").last().click()
        cy.get('.job-note-popover').last().contains(notes).wait(300)
        cy.get('.cdk-overlay-backdrop').click()
        cy.get("div > div > span > i.anticon.pointer.mr-2.anticon-edit.ng-star-inserted > svg").last().click({force:true})
        cy.contains("Edit a Note")
        cy.get("#jobNote").clear({force:true}).type("Edited Notes")
        cy.get("#pin-note > button").click()
        cy.get("div > div.ant-modal-footer.ng-star-inserted > button.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.contains("Job note has been successfully updated")
        cy.get("nz-page-header-content.job-notes.ant-page-header-content.ng-star-inserted > div > div > div > nz-card > div.ant-card-body > p").last().click()
        cy.get('.job-note-popover').last().contains("Edited Notes").wait(300)
    })
    
    it("As A org Admin I should be able to assign and un-assigend the job to technician", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get(" table > tbody > tr:nth-child(2) > td:nth-child(9) > span > span:nth-child(1) > a > i").click({ force: true })
        cy.get("section > section.ant-col.ant-col-24 > section > nz-page-header > div > nz-page-header-title").contains("Job Details")
        cy.wait(2000)
        cy.get("nz-page-header-content:nth-child(3) > nz-row > nz-statistic:nth-child(4) > div.ant-statistic-title > span > i").click()
        cy.get('.ant-select-search__field').type('{backspace}{backspace}{backspace}{backspace}')
        cy.get('.cdk-overlay-backdrop').click({force:true})
        cy.get('.ant-empty-description').contains("No Data")
        cy.get("div.ant-modal-footer.ng-star-inserted > button.ant-btn.ng-star-inserted.ant-btn-primary").click()
        cy.get("nz-page-header > div > nz-page-header-extra > span.job-status-block > nz-tag").contains(" UNASSIGNED ")
        cy.get("nz-page-header-content:nth-child(3) > nz-row > nz-statistic:nth-child(4) > div.ant-statistic-title > span > i").click()
        cy.get("section > nz-spin > div > app-select-technicians > section > nz-select > div > div").click()
        cy.get('.ant-select-dropdown-menu >').contains("Brian Lara").click()
        cy.get('.cdk-overlay-backdrop').click({force:true})
        cy.get("nz-list-item > nz-list-item-meta > div.ant-list-item-meta-content.ng-star-inserted > h4").contains("Brian Lara")
        cy.get("div.ant-modal-footer.ng-star-inserted > button.ant-btn.ng-star-inserted.ant-btn-primary").click().wait(2000)
        cy.get("nz-page-header-content:nth-child(3) > nz-row > nz-statistic:nth-child(4) > div.ant-statistic-content > nz-statistic-number > span").contains(" Brian Lara")
        cy.get("nz-page-header > div > nz-page-header-extra > span.job-status-block > nz-tag").contains(" SCHEDULED ")   
    })

    it("As a Org Admin I should be able to schedule and reschedule the job", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get(" table > tbody > tr:nth-child(2) > td:nth-child(9) > span > span:nth-child(1) > a > i").click({ force: true })
        cy.get("section > section.ant-col.ant-col-24 > section > nz-page-header > div > nz-page-header-title").contains("Job Details")
        cy.get('.ant-btn').click()
        cy.get("div > div > ul > li:nth-child(2) > a").click()
        cy.get("div > div.ant-modal-header.ng-star-inserted > div > div").contains("Reschedule Job")
        cy.get('.ant-calendar-picker-input').click({ force: true })
        cy.wait(2000)
        cy.get('[title="August 30, 2020"] > .ant-calendar-date').click({ force: true })
        cy.get('.ant-time-picker-input').click()
        cy.get('.ant-time-picker-panel-input-wrap').type("10:10:10")
        cy.get('.cdk-overlay-backdrop').click({ force: true })
        cy.get("div > div.ant-modal-footer.ng-star-inserted > button.ant-btn.ng-star-inserted.ant-btn-primary").click().wait(2000)
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(1) > div.ant-statistic-content > nz-statistic-number > span").contains("Aug 30, 2020 10:10 am")
        cy.get("nz-page-header > div > nz-page-header-extra > span.job-status-block > nz-tag").contains(" SCHEDULED ")
    })
    
    it("As a Org Admin I should be able to change the status of job as schedule / unassigned / dispatch / inprogress / hold ", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get(" table > tbody > tr:nth-child(2) > td:nth-child(9) > span > span:nth-child(1) > a > i").click({ force: true })
        cy.get("section > section.ant-col.ant-col-24 > section > nz-page-header > div > nz-page-header-title").contains("Job Details")
        cy.wait(2000)
        cy.get('.ant-btn').click()
        cy.get("div > div > ul > li:nth-child(4) > a").click()
        cy.get("nz-page-header > div > nz-page-header-extra > span.job-status-block > nz-tag").contains(" DISPATCHED")
        cy.get(" section > nz-page-header > div > nz-page-header-tags > nz-row > i.anticon.ml-2.pointer.anticon-edit.ng-star-inserted").should("not.be.visible")
        cy.wait(2000)
        cy.get('.ant-btn').click()
        cy.get("div > div > ul > li:nth-child(3) > a").click()
        cy.get("nz-page-header > div > nz-page-header-extra > span.job-status-block > nz-tag").contains(" INPROGRESS")
        cy.get(" section > nz-page-header > div > nz-page-header-tags > nz-row > i.anticon.ml-2.pointer.anticon-edit.ng-star-inserted").should("not.be.visible")
        cy.wait(2000)
        cy.get('.ant-btn').click()
        cy.get("div > div > ul > li:nth-child(2) > a").click()
        cy.get("#remarks").type("This is hold remark")
        cy.get("div.ant-modal-footer.ng-star-inserted > button.ant-btn.ng-star-inserted.ant-btn-primary").click().wait(1000)
        cy.get("nz-page-header > div > nz-page-header-extra > span.job-status-block > nz-tag").contains(" HOLD")
        cy.get(" section > nz-page-header > div > nz-page-header-tags > nz-row > i.anticon.ml-2.pointer.anticon-edit.ng-star-inserted").should("be.visible")
        cy.get("nz-page-header-content:nth-child(3) > nz-row > nz-statistic.ant-statistic.ng-star-inserted > div.ant-statistic-content > nz-statistic-number > p").contains(" This is hold remark")
        cy.get('.ant-btn').click()
        cy.get("div > div > ul > li:nth-child(1) > a").click()
        cy.get("div > div.ant-modal-header.ng-star-inserted > div > div").contains("Reschedule Job")
        cy.get('.ant-calendar-picker-input').click({ force: true })
        cy.wait(2000)
        cy.get('[title="August 30, 2020"] > .ant-calendar-date').click({ force: true })
        cy.get('.ant-time-picker-input').click()
        cy.get('.ant-time-picker-panel-input-wrap').type("10:10:10")
        cy.get('.cdk-overlay-backdrop').click({ force: true })
        cy.get("div > div.ant-modal-footer.ng-star-inserted > button.ant-btn.ng-star-inserted.ant-btn-primary").click().wait(2000)
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(1) > div.ant-statistic-content > nz-statistic-number > span").contains("Aug 30, 2020 10:10 am")
        cy.get("nz-page-header > div > nz-page-header-extra > span.job-status-block > nz-tag").contains(" SCHEDULED ")
    })

    it("As a Org Admin I should be able to send the survay link", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get(" table > tbody > tr:nth-child(2) > td:nth-child(9) > span > span:nth-child(1) > a > i").click({ force: true })
        cy.get("section > section.ant-col.ant-col-24 > section > nz-page-header > div > nz-page-header-title").contains("Job Details")
        cy.wait(2000)
        cy.get('.ant-btn').click()
        cy.get("div > div > ul > li:nth-child(5) > a").click()
        cy.get("div > div > div.ant-modal-header.ng-star-inserted > div > div").contains("Send Survey Link")
        cy.get("nz-form-control > div > span > button").should("be.disabled")
        const link="https://www.npmjs.com/package/Faker"
        cy.get("#surveyLink").type("bla bla")
        cy.contains("Enter a vald link")
        cy.get("#surveyLink").clear().type(link)
        cy.get("nz-form-control > div > span > button").should("be.enabled").click().wait(150)
        cy.contains("Survey link has been successfully sent")
    })

    it("As a Org Admin I should be able to update the job details", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Jobs")
        cy.get(" table > tbody > tr:nth-child(2) > td:nth-child(9) > span > span:nth-child(1) > a > i").click({ force: true })
        cy.get("section > section.ant-col.ant-col-24 > section > nz-page-header > div > nz-page-header-title").contains("Job Details")
        cy.get("nz-row > i.anticon.ml-2.pointer.anticon-edit.ng-star-inserted").click()
        cy.get("div > div > div.ant-modal-header.ng-star-inserted > div > div").contains("Edit a Job")

        // css selector for elements
        const lead_source_ele = "section:nth-child(2) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input"
        const job_type_ele = "section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div"
        const business_unit_ele = "section:nth-child(1) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div"
        const summary_ele = "section:nth-child(2) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > textarea"
        const technician_ele = "section:nth-child(3) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div"
        const tags_ele = "section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div"
        const start_date_ele = "section:nth-child(4) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-date-picker > nz-picker > span > input"
        const start_time_ele = "section:nth-child(4) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-time-picker > input"
        const project_ele = "section:nth-child(5) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div"
        const service_add_ele = "section:nth-child(6) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div"
        const billing_add_ele = "section:nth-child(6) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div"
        const update_btn_ele = "section > section > nz-form-item > nz-form-control > div > span > button"

        //faker data 
        const job_type = "Haven"
        const busines_unit = "Marion"
        const lead_source = titleCase(faker.name.lastName() + "Source")
        const summary = faker.lorem.sentence()
        const technician = "Brian Lara"
        const tag = "Tag1"
        const start_date = "12/23/2020"
        const start_time = "10:10:10"

        //update details 

        cy.get(job_type_ele).click()
        cy.get('.ant-select-dropdown-menu >').contains(job_type).click()
        cy.get(business_unit_ele).click()
        cy.get('.ant-select-dropdown-menu >').contains(busines_unit).click()
        cy.get(lead_source_ele).clear().type(lead_source)
        cy.get(summary_ele).clear().type(summary)
        cy.get("nz-select > div > div > ul > li.ant-select-selection__choice.ng-trigger.ng-trigger-zoomMotion.ng-tns-c24-147.ng-star-inserted > span > i").click()
        cy.get(technician_ele).click()
        cy.get('.ant-select-dropdown-menu >').contains(technician).click()
        cy.get('.cdk-overlay-backdrop').click({ force: true })
    })

});
function titleCase(text) {
    let sentence = text.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(' ');
}