///<reference types="Cypress"/>
const data = require('../../fixtures/data.json')

describe("Customer Listing", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })
    
    //IT- Navigate to the customer page 
    it("As a Org Admin I should be able to navigate on Customer page", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
    })
    
    //IT- searching by search bar
    it("As a Org Admin I should be able search customer by search bar", () => {
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        cy.readFile("customer1.json").then((data) => {
            cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input")
                .should("be.visible")
                .clear()
                .wait(2000)
                .type(data.fname + " " + data.lname)
                .wait(2000)
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span").contains(data.fname + " " + data.lname);
            const phone=data.office_phone.replace(/[^\d]/g, "");
            cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input")
                .should("be.visible")
                .clear()
                .wait(2000)
                .type(phone)
                .wait(2000)
                
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(4) > span > span").contains(data.office_phone);
            cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input")
                .should("be.visible")
                .clear()
                .wait(2000)
                .type(data.email)
                .wait(2000)
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(5) > span").contains(data.email);
            cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input")
                .should("be.visible")
                .clear()
                .wait(2000)
        });
    })
    
    //IT- change the status as active and inactive 
    it("As a Org Admin I should be able to change the status of customer As Active or Inactive", () => {
        
        cy.wait(1000)
        cy.get('[ng-reflect-nz-title="Customers"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Customers ")
        
        // select all rows to activate
        cy.get(
            "table > thead > tr > th.ant-table-selection-column.ng-star-inserted > span > div > span > label > span.ant-checkbox > input "
        ).check();
        cy.get(
            "section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost"
        ).click();
        cy.get(
            "section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost"
        ).trigger("mouseover");
        cy.get(".ant-dropdown-menu > :nth-child(1) > a").click();
        cy.wait(3000);
        cy.get(
            "table > thead > tr > th.ant-table-selection-column.ng-star-inserted > span > div > span > label > span.ant-checkbox > input "
        ).uncheck();
        // check action button without select any row
        cy.get(
            "section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost"
        ).click();
        cy.get(
            "section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost"
        ).trigger("mouseover");
        cy.get(".ant-dropdown-menu > :nth-child(1) > a").click();
        cy.contains("Please select a row to change the status");

        // select specific rows to deactivate
        cy.get("table > tbody > tr:nth-child(1) > td.ant-table-selection-column.ng-star-inserted > label > span.ant-checkbox > input")
            .should("not.be.checked")
            .check();
        cy.get("table > tbody > tr:nth-child(2) > td.ant-table-selection-column.ng-star-inserted > label > span.ant-checkbox > input")
            .should("not.be.checked")
            .check();
        cy.get("table > tbody > tr:nth-child(3) > td.ant-table-selection-column.ng-star-inserted > label > span.ant-checkbox > input")
            .should("not.be.checked")
            .check();

        cy.get("section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost").click();
        cy.get("section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost").trigger("mouseover");
        cy.get(".ant-dropdown-menu > :nth-child(2) > a").click();
        cy.wait(1000);
        cy.contains("Status has been successfully updated");
        cy.wait(2000);

        //verify the status of the employee
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > nz-tag").contains("INACTIVE ");
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(6) > span > span > nz-tag").contains("INACTIVE ");
        cy.get("table > tbody > tr:nth-child(3) > td:nth-child(6) > span > span > nz-tag").contains("INACTIVE ");

        //check the filter active/inactive
        cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click();
        cy.get("ul > li:nth-child(2) > label > span.ant-checkbox > input").check();
        cy.get("div > div > div > a.ant-table-filter-dropdown-link.confirm > span").click();
        //verify the filterd list
        cy.wait(2000);
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > nz-tag").contains("INACTIVE ");
        //to reset the filter
        cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click();
        cy.get(".clear > span").click();

        // select all rows to activate
        cy.get("table > thead > tr > th.ant-table-selection-column.ng-star-inserted > span > div > span > label > span.ant-checkbox > input "
        ).check();
        cy.get("section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost").click();
        cy.get("section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost").trigger("mouseover");
        cy.get(".ant-dropdown-menu > :nth-child(1) > a").click();
        cy.contains("Status has been successfully updated");
        cy.wait(3000);
        cy.get("table > thead > tr > th.ant-table-selection-column.ng-star-inserted > span > div > span > label > span.ant-checkbox > input ").uncheck();
        //verify the status of one employee
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > nz-tag").contains("ACTIVE ");
    })
});