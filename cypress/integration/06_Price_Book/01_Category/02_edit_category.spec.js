///<reference types="Cypress"/>
const data = require('../../../fixtures/data.json')

describe("Edit Category", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
      })
      afterEach("Logout", () => {
        cy.logout()
      })

    //IT- Navigate to Edit Category page 
    it("As a Org Admin I should be able to navigate on Edit Category page", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Categories ")
        cy.get("section > app-page-header > section > section.description-content-container > section").contains(" Manage the categories of your services. ")
    })
    
    //IT- Edit Category
    it("As a Org Admin I should be able to Edit the Category", () => {
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Categories ")
        cy.get("section > app-page-header > section > section.description-content-container > section").contains(" Manage the categories of your services. ")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span > a").click()
        cy.wait(2000)
        cy.get("div > section.page-header-container > app-page-header > section > section.title-content-container > section").contains(" Edit Category ")
        cy.get("#name").should("be.disabled")
        cy.get("#code").should("be.disabled")
        const BU = "Quentin";
        const status = "Inactive";
        cy.get("#bu > div").click();
        cy.get('.ant-select-dropdown-menu > ').contains(BU).click()
        cy.get("form > div > div.ant-col.ant-col-16 > div:nth-child(3) > div:nth-child(2) > div > nz-form-item > nz-form-control > div > span > nz-select > div").click()
        cy.get('.ant-select-dropdown-menu > ').contains(status).click()
        cy.get("div > div.ant-col.ant-col-16 > nz-form-item.register-area.mt-4.text-right.ant-form-item.ant-row > nz-form-control > div > span > button").click()
        cy.wait(1000)
        cy.contains("Category has been successfully updated")
        cy.get("section > section > app-page-header > section > section.title-content-container > section").contains(" Categories ")
        cy.wait(2000)
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(5) > span > span").contains(BU)
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(6) > span > span > nz-tag").contains(status.toUpperCase())
    })
})
