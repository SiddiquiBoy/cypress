///<reference types="Cypress"/>

const data = require('../../../../fixtures/data.json')
import faker, { fake } from "faker";

describe("Edit Timesheet Code", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })
    
    it("As a Org Admin I should navigate on edit Timesheet Code page", () => {
        cy.wait(1000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")
        cy.wait(1000)
        cy.get(':nth-child(1) > :nth-child(7) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg').click({force:true});
        cy.wait(1000)
        cy.get(' section > nz-spin > div > section > app-page-header > section > section.title-content-container > section').contains("Edit a Timesheet Code");
    })
    

    it("As a Org Admin I should be able to edit the timesheet code details", () => {
        cy.wait(3000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")
        cy.wait(1000)
        cy.get(':nth-child(1) > :nth-child(7) > :nth-child(1) > .ng-star-inserted > a > .anticon > svg').click({ force: true });
        cy.wait(1000)
        cy.get(' section > nz-spin > div > section > app-page-header > section > section.title-content-container > section').contains("Edit a Timesheet Code");
        const type = "Unpaid";
        //const master_pay_bu= "Zola";
        const master_pay_bu = "Jackson";
        const status = "Inactive";
        cy.get("form > div:nth-child(2) > div:nth-child(1) > nz-form-item > nz-form-control > div > span > nz-select > div > div").click();
        cy.get('.ant-select-dropdown-menu >').contains(status).click();
        const desciption = "Edited description"
        // Write data in JSON file
        cy.writeFile("timesheet_code.json", {
            desciption: desciption,
            type: type,
            master_pay_Bu: master_pay_bu,
        });
        cy.get("form > div:nth-child(1) > div:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div").click();
        cy.get(".ant-select-dropdown-menu >").contains(type).click();
        cy.get("form > div:nth-child(2) > div:nth-child(2) > nz-form-item > nz-form-control > div > span > nz-select > div").click();
        cy.wait(1000);
        cy.get(".ant-select-dropdown-menu >").contains(master_pay_bu).click();
        cy.get("form > nz-form-item:nth-child(3) > nz-form-control > div > span > textarea")
            .should("be.visible")
            .clear()
            .type(desciption);
        cy.get(".mr-auto").should("be.enabled").click();
        cy.wait(500);
        cy.contains("Timesheet Code has been successfully updated");
        cy.wait(500);
        cy.get('.title-container').contains("Timesheet Codes")
        cy.wait(500);
        cy.verify_timesheet_code_data(status);
    });

});