import faker from "faker";
Cypress.Commands.add("job_form", () => {

    const job_type = "Jazmin";
    const business_unit = "Jackson"
    const lead_source = titleCase(faker.lorem.words())
    const summary = faker.lorem.paragraph()
    const technician = "Brandy Hoppe"
    const tag = "Tag1"
    const date = "Aug 15, 2020"
    const time = "13:13:13"
    const customer = "Ernest Macgyver"
    const project = "Klocko"
    const billing_address = "Stanley Brooks"
    const service_address = "Stanley Brooks";
    const services = "Practical Steel Chair"

    cy.writeFile("job.json", {
        job_type: job_type,
        business_unit: business_unit,
        lead_source: lead_source,
        summary: summary,
        technician: technician,
        tag: tag,
        date: date,
        time: time,
        billing_address: billing_address,
        service_address: service_address,
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
    cy.get('.ant-calendar-picker-input').click({ force: true })
    cy.wait(2000)
    cy.get('[title="August 15, 2020"] > .ant-calendar-date').click({ force: true })
    cy.get('.ant-time-picker-input').click()
    cy.get('.ant-time-picker-panel-input-wrap').type(time)
    cy.get('.cdk-overlay-backdrop').click({ force: true })
    cy.get("section:nth-child(5) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
    cy.get('.ant-select-dropdown-menu >').contains(customer).click({ force: true }).wait(1500)
    cy.get("section:nth-child(5) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
    cy.get('.ant-select-dropdown-menu >').contains(project).click()
    cy.get("section:nth-child(6) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
    cy.get('.ant-select-dropdown-menu >').contains(billing_address).click()
    cy.get("body > div > div.cdk-overlay-backdrop.nz-overlay-transparent-backdrop.cdk-overlay-backdrop-showing").click()
    cy.get("section:nth-child(6) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
    cy.get('.ant-select-dropdown-menu >').contains(service_address).click()
    cy.get("body > div > div.cdk-overlay-backdrop.nz-overlay-transparent-backdrop.cdk-overlay-backdrop-showing").click()
    cy.get("section:nth-child(7) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
    cy.get('.ant-select-dropdown-menu >').contains(services).click()
    cy.get('form > section > section > nz-form-item > nz-form-control > div > span > button').should("be.enabled")
    cy.get('.cdk-overlay-backdrop').click({ force: true })

})

Cypress.Commands.add("verify_job_data", (status) => {
    cy.readFile("job.json").then((data) => {

        //verify on details page 
        //cy.go("back")
        cy.wait(3000)
        cy.get("section.ant-col.ant-col-24 > section > nz-page-header > div > nz-page-header-title").contains("Job Details")
        cy.get("section > nz-page-header > nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(1) > div.ant-statistic-content > nz-statistic-number > span").contains(data.date + " " + "1:13 pm")
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(2) > div.ant-statistic-content > nz-statistic-number > span").contains(data.job_type)
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(3) > div.ant-statistic-content > nz-statistic-number > span").contains(data.lead_source)
        cy.get("nz-page-header-content:nth-child(2) > nz-row > nz-statistic:nth-child(4) > div.ant-statistic-content > nz-statistic-number > span").contains(data.business_unit)
        cy.get("nz-statistic:nth-child(5) > div.ant-statistic-content > nz-statistic-number > a").contains(data.project)
        cy.get("nz-statistic:nth-child(6) > div.ant-statistic-content > nz-statistic-number > a").contains(data.customer)
        cy.get('.job-tag').contains(data.tag.toUpperCase())
        cy.get('[ng-reflect-nz-title="Services"] > .ant-statistic-content > .ant-statistic-content-value > .flex-center').contains(data.services)
        cy.get('[ng-reflect-nz-title="[object Object]"] > .ant-statistic-content > .ant-statistic-content-value > .flex-center').contains(data.technician)
        cy.get('[ng-reflect-nz-title="Service Location"] > .ant-statistic-content > .ant-statistic-content-value > :nth-child(3)').contains(data.service_address)
        cy.get('[ng-reflect-nz-title="Bill To"] > .ant-statistic-content > .ant-statistic-content-value > :nth-child(3)').contains(data.billing_address)
        cy.get('.ant-statistic-content-value > .pointer').click()
        cy.get("div.ant-popover-inner > div > div > p").contains(data.summary)
        cy.get('.cdk-overlay-backdrop').click({force:true})

        //verify in table 
        cy.get('[ng-reflect-nz-title="Jobs"] > a').click().wait(2000)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(1) > span > span").contains(data.job_type)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span").contains(data.date)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(3) > span > span").contains("1:13 pm")
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(4) > span > span").contains(data.tag)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(5) > span > span").contains(data.summary)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span").contains(data.project)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span").contains(data.customer)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(8) > span > span").contains(status)


        //Verify on edit page 
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(9) > span > span:nth-child(2) > a > i").click()
        cy.wait(1000)
        cy.get("app-page-header > section > section.title-content-container > section").contains("Edit Job")
        cy.get("section:nth-child(1) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div").contains(data.job_type)
        cy.get("section:nth-child(1) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div").contains(data.business_unit)
        cy.wait(2000)
        cy.get("section:nth-child(3) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div").contains(data.technician)
        cy.get("section:nth-child(3) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div").contains(data.tag)
        cy.get('.ant-calendar-picker-input').should("have.value", "08/15/2020")
        cy.get('.ant-time-picker-input').should("have.value", data.time)
        cy.get("section:nth-child(5) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").contains(data.customer)
        cy.get("section:nth-child(5) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div").contains(data.project)
        cy.get("section:nth-child(6) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").contains(data.billing_address)
        cy.get("section:nth-child(6) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div").contains(data.service_address)
        cy.get("section:nth-child(7) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").contains(data.services)

        
    })

})

function titleCase(text) {
    let sentence = text.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(' ');
}