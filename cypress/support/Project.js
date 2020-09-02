
import faker from "faker";
import { writeFile, readFile } from "fs";
import { data } from "cypress/types/jquery";
Cypress.Commands.add("Project_Details_form", () => {
    cy.readFile("customer1.json").then((data) => {
        // const customer_name = "Scotty Morissette";
        const customer_name = titleCase(data.fname + " " + data.lname);
        const project_name = titleCase(faker.name.lastName() + " Project");
        cy.writeFile("project_detail_form.json", {
            customer_name: customer_name,
            project_name: project_name
        })
        cy.get("section:nth-child(1) > nz-form-item > nz-form-control > div > span > input").clear().type(project_name);
        cy.get("section:nth-child(1) > section.ant-col.ant-col-12.ng-star-inserted > nz-form-item > nz-form-control > div > span > nz-select > div").click()
        cy.get(".ant-select-dropdown-menu >").contains(customer_name).click()
    })
});
Cypress.Commands.add("Project_Job_form", (status) => {

    cy.readFile("customer2.json").then((data) => {

        const job_type = "Jazmin"
        const business_unit = "Jackson"
        const lead_source = titleCase(faker.lorem.words())
        const summary = faker.lorem.paragraph()
        const technician = "Brandy Hoppe"
        const tag = "Tag1"
        const date = "12/12/2020"
        const time = "13:13:13"
        const billing_address = data.street
        const service_address = data.street
        const services = "Practical Steel Chair"

        cy.writeFile("project_job_form.json", {
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
            status: status
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
        cy.get("section:nth-child(4) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-date-picker > nz-picker > span > input").click()
        cy.get('.ant-calendar-input-wrap').type(date).type('{enter}')
        cy.wait(2000)
        cy.get('.ant-time-picker-input').click()
        cy.get('.ant-time-picker-panel-input-wrap').type(time)
        cy.get('.cdk-overlay-backdrop').click({ force: true })
        cy.get("section:nth-child(5) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
        cy.get('.ant-select-dropdown-menu >').contains(billing_address).click()
        cy.get("body > div > div.cdk-overlay-backdrop.nz-overlay-transparent-backdrop.cdk-overlay-backdrop-showing").click()
        cy.get("section:nth-child(5) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click()
        cy.get('.ant-select-dropdown-menu >').contains(service_address).click()
        cy.get("body > div > div.cdk-overlay-backdrop.nz-overlay-transparent-backdrop.cdk-overlay-backdrop-showing").click()
        cy.get("section:nth-child(6) > section:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div").click()
        cy.get('.ant-select-dropdown-menu >').contains(services).click()
        cy.get(':nth-child(2) > .add-button-container > .mr-auto').should("be.enabled")
        cy.get('.cdk-overlay-backdrop').click({ force: true })
    })
})

function titleCase(text) {
	let sentence = text.toLowerCase().split(' ');
  for(let i = 0; i< sentence.length; i++) {
  	sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence.join(' ');
}
