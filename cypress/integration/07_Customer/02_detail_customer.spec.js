///<reference types="Cypress"/>
import faker from "faker";
import "cypress-file-upload";
import { readFile } from "fs";
const data = require("../../fixtures/data.json");
import 'cypress-wait-until';

describe("Company Detail", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    it("As a Org Admin I should be able to navigate on Customer details page", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span:nth-child(1) > a > i").click().wait(2000)
        cy.get("section > section > section > nz-page-header > div > nz-page-header-title").contains(" Customer Details")

    });

    it("Verify the labels and titles on Customer details page", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span:nth-child(1) > a > i").click().wait(2000)
        cy.get("section > section > section > nz-page-header > div > nz-page-header-title").contains(" Customer Details")
        cy.get(':nth-child(1) > .ant-statistic-title > .statistic-title-span').contains("NAME")
        cy.get(':nth-child(2) > .ant-statistic-title > .statistic-title-span').contains("HOME PHONE")
        cy.get(':nth-child(3) > .ant-statistic-title > .statistic-title-span').contains("OFFICE PHONE")
        cy.get(':nth-child(4) > .ant-statistic-title > .statistic-title-span').contains("EMAIL")
        cy.get(':nth-child(5) > .ant-statistic-title > .statistic-title-span').contains("BUSINESS UNIT")
        cy.get('.customer-view-address-container > :nth-child(1) > :nth-child(1) > h5').contains("Address")
        cy.get('.customer-view-projects-container > :nth-child(1) > :nth-child(1) > h5').contains("Projects")
        cy.get('.view-customer-spin-container > :nth-child(1) > h5').contains("Jobs")
    });

    it("As a Org Admin I should be able to Add/Edit/Search Address for Customer on customer details page", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span:nth-child(1) > a > i").click().wait(2000)
        cy.get("section > section > section > nz-page-header > div > nz-page-header-title").contains(" Customer Details")
        cy.get("app-general-table > div > section > section.buttons-container.ng-star-inserted > button").first().click().wait(1000)

        //Element's css selectors 
        const state_ele = "section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div"
        const city_ele = "#addCity"
        const street_ele = "form > section:nth-child(2) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input"
        const landmark_ele = "form > section:nth-child(3) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input"
        const zipcode_ele = "form > section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input"
        const lattitude_ele = "section:nth-child(4) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input"
        const longitude_ele = "section:nth-child(4) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input"

        //verify the validation 
        cy.get(city_ele).clear().type("City bla bla").clear()
        cy.contains("Enter a valid City")
        cy.get(street_ele).clear().type("street bla @Ad").clear()
        cy.contains("Enter a street")
        cy.get(zipcode_ele).clear().type("12321").clear()
        cy.contains("Enter a valid zipcode")
        cy.get(lattitude_ele).clear().type("dada")
        cy.contains("Enter a valid latitude")
        cy.get(longitude_ele).clear().type("dasd")
        cy.contains("Enter a valid longitude")
        //verify with the invalid data 
        cy.reload().wait(2000)
        cy.get("app-general-table > div > section > section.buttons-container.ng-star-inserted > button").first().click().wait(1000)
        cy.get(zipcode_ele).clear().type("dsad")
        cy.contains("Enter a valid zipcode")

        //fill the valid data and create an address for the customer 
        cy.reload().wait(2000)
        cy.get("app-general-table > div > section > section.buttons-container.ng-star-inserted > button").first().click().wait(1000)
        //create faker data 
        const state = faker.address.state()
        const city = titleCase(faker.address.city())
        const street = faker.address.streetAddress()
        const landmark = "Near " + faker.name.lastName()
        const zipcode = faker.address.zipCode().substring(0, 5);
        //fill address form 
        cy.get(state_ele).click()
        cy.get(".ant-select-dropdown-menu >").contains(state).click()
        cy.get(city_ele).clear().type(city)
        cy.get(street_ele).clear().type(street)
        cy.get(landmark_ele).clear().type(landmark)
        cy.get(zipcode_ele).clear().type(zipcode)
        cy.get('.mr-auto').click().wait(250)
        cy.contains("Customer address has been successfully added")
        cy.wait(2000)
        //verify data in table 
        cy.get("section.customer-view-address-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(1)").last().contains(street)
        cy.get("section.customer-view-address-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(2)").last().contains(state)
        cy.get("section.customer-view-address-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(4)").last().contains(zipcode)
        cy.get("section.customer-view-address-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(3)").last().contains(city)

        //verify the address data in edit view and update street name as well
        cy.get("section.customer-view-address-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(5) > span > span:nth-child(1) > a > i  > svg").last().click({ force: true }).wait(2000)
        cy.get("div > div > div.ant-modal-header.ng-star-inserted > div > div").contains("Edit Address")
        cy.get(state_ele).contains(state).wait(2000)
        cy.get(city_ele).should("have.value", city)
        cy.get(street_ele).should("have.value", street)
        cy.get(landmark_ele).should("have.value", landmark)
        cy.get(zipcode_ele).should("have.value", zipcode)
        cy.get(street_ele).clear().type("Updated street :)")
        cy.get("form > nz-form-item > nz-form-control > div > span > button").click().wait(200)
        cy.contains("Customer address has been successfully updated")
        cy.wait(2000)
        //verify in table 
        cy.get("section.customer-view-address-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(1)").last().contains("Updated Street :)")
        //verify searching functionlity
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").first().clear().type("Updated Street :)").wait(2000)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(1) > span > span").first().contains("Updated Street :)").wait(2000)
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").first().clear().wait(2000).type("dsasd").wait(200)
        cy.get("div.ant-table-placeholder.ng-star-inserted > nz-embed-empty > nz-empty > p").contains(" No Data ")
        cy.wait(2000)
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").first().clear().wait(3000)
        // delete the address
        cy.get("app-customer-address-list > section.customer-view-address-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(5) > span > span:nth-child(2) > a > i > svg").last().click({ force: true })
        cy.get("div > div > div.ant-modal-body.ng-star-inserted > section > nz-spin > div").contains("Are you sure you want to delete this address?")
        cy.get("div.ant-modal-footer.ng-star-inserted > button.ant-btn.ng-star-inserted.ant-btn-primary").click().wait(250)
        cy.contains("Customer address has been successfully deleted")

    });

    it("As a Org Admin I should be able to add new project for customer", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span:nth-child(1) > a > i").click().wait(2000)
        cy.get("section > section > section > nz-page-header > div > nz-page-header-title").contains(" Customer Details")
        cy.get("app-general-table > div > section > section.buttons-container.ng-star-inserted > button").eq(1).click().wait(1000)
        cy.get("div > div > div.ant-modal-header.ng-star-inserted > div > div").contains("Add Project")
        //Element's css selectors 
        const project_name_ele = "section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input"
        const status_ele = " section:nth-child(2) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div"
        //faker data 
        const project_name = titleCase(faker.name.firstName()) + " Project"
        //verify the validations on add project 
        cy.get("section > nz-spin > div > section > form > section.text-right > button").should("be.disabled")
        cy.get(project_name_ele).clear().type("Asdasd").clear()
        cy.contains("Enter valid name")
        //create new project 
        cy.get(project_name_ele).clear().type(project_name)
        cy.get("section > nz-spin > div > section > form > section.text-right > button").click().wait(250)
        cy.contains("Customer project has been successfully added")
        cy.wait(2000)
        cy.get("div > nz-table > nz-spin > div > nz-pagination > ul > div > nz-select > div > div > div").eq(1).click()
        cy.get("div > div > ul > li:nth-child(4)").click().wait(2000)
        //verify the project in table view 
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").eq(1).clear().type(project_name).wait(2000)
        cy.get("app-customer-project-list > section > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > span > span").contains(project_name)
        cy.get("app-customer-project-list > section > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(4) > span > span").contains(" ACTIVE")
        //verify data in edit view and update project name 
        cy.get("app-customer-project-list > section > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > span > span:nth-child(2) > a > i").click().wait(1000)
        cy.get(project_name_ele).should("have.value", project_name)
        cy.get(status_ele).contains("Active")
        cy.get(project_name_ele).clear().type("Edited Project :(")
        cy.get(status_ele).click()
        cy.get("div > div > ul > li:nth-child(2)").click().wait(1000)
        cy.get("div > section > form > section.text-right > button").click().wait(2000)
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").eq(1).clear().type("Edited Project :(").wait(2000)
        cy.get("app-customer-project-list > section > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > span > span").contains("Edited Project :(").wait(2000)
        cy.get("app-customer-project-list > section > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(4) > span > span").contains(" INACTIVE")
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").eq(1).clear().wait(3000)

    });

    it("As a Org Admin I should be able to add the new Job for customer ", () => {

        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span:nth-child(1) > a > i").click().wait(2000)
        cy.get("section > section > section > nz-page-header > div > nz-page-header-title").contains(" Customer Details")
        cy.get("app-general-table > div > section > section.buttons-container.ng-star-inserted > button").eq(2).click().wait(1000)
        cy.get("div > div > div.ant-modal-header.ng-star-inserted > div > div").contains("Add a Job")

        //element's css selector of jobs form 
        const lead_source_ele = "section:nth-child(2) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input"
        const job_type_ele = "section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div"
        const business_unit_ele = "section:nth-child(1) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div"
        const summary_ele = "section:nth-child(2) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > textarea"
        const technicians_ele = "section:nth-child(3) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div"
        const tags_ele = "section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div"
        const start_date_ele = ".ant-calendar-picker-input"
        const start_time_ele = "section:nth-child(4) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-time-picker > input"
        const project_name_ele = "section:nth-child(5) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div"
        const billing_add_ele = "section:nth-child(6) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div"
        const service_add_ele = "section:nth-child(6) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div"
        const services_ele = "section:nth-child(7) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div"
        const status_ele = "section:nth-child(7) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div"

        //generate faker data
        const lead_source = titleCase(faker.name.lastName() + " Source")
        const job = "Jazmin"
        const business_unit = "Tre"
        const summary = faker.lorem.sentence()
        const tecnician = "Brandy Hoppe"
        const tag = "Tag1"
        const start_date = "12/12/2020"
        const start_time = "13:13:13"
        const service = "Gorgeous Steel Bacon"

        //fill the add job form 
        cy.get(lead_source_ele).clear().type("Sadd").clear()
        cy.contains("Enter a lead source")
        cy.get(job_type_ele).click()
        cy.get('.ant-select-dropdown-menu >').contains(job).click()
        cy.get(business_unit_ele).click()
        cy.get('.ant-select-dropdown-menu >').contains(business_unit).click()
        cy.get(lead_source_ele).clear().type(lead_source)
        cy.get(summary_ele).clear().type(summary)
        cy.get(technicians_ele).click()
        cy.get('.ant-select-dropdown-menu >').contains(tecnician).click()
        cy.get('.cdk-overlay-backdrop').click()
        cy.get(tags_ele).click()
        cy.get('.ant-select-dropdown-menu >').contains(tag).click();
        cy.get('.cdk-overlay-backdrop').click()
        cy.get(project_name_ele).click()
        cy.get('.ant-select-dropdown-menu >').first().click()
        cy.get(billing_add_ele).click()
        cy.get('.ant-select-dropdown-menu >').first().click()
        cy.get('.cdk-overlay-backdrop').click()
        cy.get(service_add_ele).click()
        cy.get('.ant-select-dropdown-menu >').first().click()
        cy.get('.cdk-overlay-backdrop').click()
        cy.get(services_ele).click()
        cy.get('.ant-select-dropdown-menu >').contains(service).click()
        cy.get('.cdk-overlay-backdrop').click()
        cy.get("section:nth-child(4) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-date-picker > nz-picker > span > input").click()
        cy.get('.ant-calendar-input-wrap').type(start_date).type('{enter}')
        cy.wait(2000)
        cy.get('.ant-time-picker-input').click()
        cy.get('.ant-time-picker-panel-input-wrap').type(start_time)
        cy.get('.cdk-overlay-backdrop').click({ force: true })
        cy.get('.mr-auto').click().wait(250)
        cy.contains("Job has been successfully added")

        //verify data in job table 
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").last().clear().type(job).wait(2000)
        cy.get("section.customer-view-jobs-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > span > span").contains(job)
        cy.get("section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").last().clear().wait(2000)
        cy.get("section.date-filter-container.ng-star-inserted > nz-date-picker > nz-picker > span > input").click()
        cy.get("date-range-popup > div > div > div > calendar-input > div").type(start_date, '{enter}').wait(2000)
        cy.get("section.customer-view-jobs-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(2) > span > span").contains("Dec 12, 2020")
        cy.get("section.customer-view-jobs-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(3) > span > span").contains("1:13 pm")
        cy.get("section.customer-view-jobs-container > nz-spin > div > app-general-table > div > nz-table > nz-spin > div > div > div > div > div > table > tbody > tr > td:nth-child(4) > span > span").contains(tag)
        
    });

    it("As a Org Admin I should be able to update the customer details", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span:nth-child(1) > a > i").click().wait(2000)
        cy.get("section > section > section > nz-page-header > div > nz-page-header-title").contains(" Customer Details")

        //generate faker data 
        const fname = titleCase(faker.name.firstName())
        const lname = titleCase(faker.name.firstName())
        const office_phone = faker.phone
            .phoneNumberFormat()
            .replace(/[^\d]/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        const home_phone = faker.phone
            .phoneNumberFormat()
            .replace(/[^\d]/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        const email = faker.internet.email().toLowerCase();
        const status = "inactive"
        const business_unit = "Tre"

        cy.writeFile("customer_detail.json", {
            fname: fname,
            lname: lname,
            office_phone: office_phone,
            home_phone: home_phone,
            email: email,
            status: status,
            business_unit: business_unit,
        })
        //web element's css selector 
        const fname_ele = "section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input";
        const lname_ele = "section:nth-child(1) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input";
        const home_phone_ele = "section:nth-child(2) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input";
        const office_phone_ele = "section:nth-child(2) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > input";
        const email_ele = "section:nth-child(3) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > input";
        const business_unit_ele = "section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div";
        const status_ele = "section:nth-child(4) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div";
        const job_notification_switch = "nz-form-item > nz-form-control > div > span > section > nz-switch > button";

        cy.get("nz-page-header > div > nz-page-header-tags > i.anticon.ml-2.pointer.anticon-edit").click()
        //verify the validation of each field on edit customer popup
        cy.get(fname_ele).clear().type("save").clear()
        cy.contains("Enter valid first name")
        cy.get(lname_ele).clear().type("sada").clear()
        cy.contains("Enter valid last name")
        cy.get(home_phone_ele).clear().type("5454").clear()
        cy.contains("Enter a valid Phone Number")
        cy.get(office_phone_ele).clear().type("5454").clear()
        cy.contains("Enter a valid Phone Number")
        cy.get(email_ele).clear().type("Das").clear()
        cy.contains("Enter valid email")
        //with invalid data
        cy.reload().wait(4000)
        cy.get("nz-page-header > div > nz-page-header-tags > i.anticon.ml-2.pointer.anticon-edit").click()
        cy.get(fname_ele).clear().type("dsa@SDA12")
        cy.contains("Enter valid first name")
        cy.get(lname_ele).clear().type("dsa@SDA12")
        cy.contains("Enter valid last name")
        cy.get(home_phone_ele).clear().type("jhgs")
        cy.contains("Enter a valid Phone Number")
        cy.get(office_phone_ele).clear().type("sda")
        cy.contains("Enter a valid Phone Number")
        cy.get(email_ele).clear().type("Das@ad@s.com")
        cy.contains("Enter valid email")
        // verify the unique check on phone 
        cy.reload().wait(4000)
        cy.get("nz-page-header > div > nz-page-header-tags > i.anticon.ml-2.pointer.anticon-edit").click()
        cy.get(home_phone_ele).clear().type(office_phone)
        cy.get(office_phone_ele).clear().type(office_phone)
        cy.contains("Home Phone cannot be same as Office Phone")
        //update data 
        cy.reload().wait(4000)
        cy.get("nz-page-header > div > nz-page-header-tags > i.anticon.ml-2.pointer.anticon-edit").click()
        cy.get(fname_ele).clear().type(fname)
        cy.get(lname_ele).clear().type(lname)
        cy.get(home_phone_ele).clear().type(home_phone)
        cy.get(office_phone_ele).clear().type(office_phone)
        cy.get(email_ele).clear().type(email)
        cy.get(business_unit_ele).click()
        cy.get(".ant-select-dropdown-menu >").contains(business_unit).click()
        cy.get(status_ele).click()
        cy.get('.ant-select-dropdown-menu > :nth-child(2)').click()
        cy.get(job_notification_switch).click()
        cy.get("form > section.action-buttons-container.text-right > button").click()
        cy.wait(250)
        cy.contains("Customer has been successfully updated")
        cy.wait(2000)

        //verify updated details on detail page 
        cy.get("nz-statistic:nth-child(1) > div.ant-statistic-content > nz-statistic-number > span").contains(fname + " " + lname)
        cy.get("nz-statistic:nth-child(2) > div.ant-statistic-content > nz-statistic-number > span").contains(home_phone)
        cy.get("nz-statistic:nth-child(3) > div.ant-statistic-content > nz-statistic-number > span").contains(office_phone)
        cy.get("nz-statistic:nth-child(4) > div.ant-statistic-content > nz-statistic-number > span").contains(email)
        cy.get("nz-statistic:nth-child(5) > div.ant-statistic-content > nz-statistic-number > span").contains(business_unit)
        cy.get("section > section > nz-page-header > div > nz-page-header-tags > nz-tag").contains(status.toUpperCase())

    });

})

function titleCase(text) {
    let sentence = text.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(' ');
}