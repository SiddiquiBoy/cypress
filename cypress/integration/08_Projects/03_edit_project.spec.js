///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')
import "cypress-file-upload";
import faker from "faker";

describe("Edit Project", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    it("As a Org Admin I should be able to navigate on Edit project page", () => {
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span:nth-child(2) > a > i").click()
        cy.get("section.page-header-container > app-page-header > section > section.title-content-container > section").contains("Edit Project")
    });

    it("As a Org Admin I should be able to update project details", () => {
        const status = "Inactive"
        const project_name = titleCase(faker.name.lastName() + " E Project")
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Projects ")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span:nth-child(2) > a > i").click()
        cy.get("section.page-header-container > app-page-header > section > section.title-content-container > section").contains("Edit Project")
        cy.get("section:nth-child(1) > nz-form-item > nz-form-control > div > span > input").clear().type(project_name);
        cy.get("section:nth-child(2) > section:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click();
        cy.get('.ant-select-dropdown-menu >').contains(status).click()
        cy.get('.ng-tns-c24-60 > .ant-select-selection').should("not.be.enabled")
        cy.get("section:nth-child(1) > section.ant-col.ant-col-12.ng-star-inserted > nz-form-item > nz-form-control > div > span > input").should("be.disabled")
        cy.get('.mr-auto').click()
        cy.wait(1000)
        cy.get('.button-container > .mr-auto').click()
        cy.wait(500)
        cy.contains("Project has been successfully updated")
        cy.wait(2000)
        cy.get("div > ul > li:nth-child(8) > a").click()
        cy.wait(2000)
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(2) > span > span").contains(project_name)
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(6) > span > span > nz-tag").contains(status.toUpperCase())
    });

});
function titleCase(text) {
    let sentence = text.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(' ');
}