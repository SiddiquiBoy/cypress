///<reference types="Cypress"/>
import "cypress-file-upload";
const data = require("../../../fixtures/data.json");

// An Organization Admin can Add and Edit Price Book Services Successfully
describe("Add Service", function () {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    //IT- Navigate to Service Listing page 
    it("As A Org Admin I should be able to navigate on Service listing page", () => {
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
        cy.wait(2000);
        cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
        cy.wait(2000);
        cy.get(".title-container").contains("Services");
    })
    //IT- Search Category via search bar 
    it("As a Org admin I should be able to search Service by search bar", () => {
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
        cy.wait(2000);
        cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
        cy.wait(2000);
        cy.get(".title-container").contains("Services");
        cy.readFile("service.json").then((data) => {
            cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().type(data.service_name)
            cy.wait(3000)
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(3) > span").contains(data.service_name).wait(3000)
            cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear().type("SER-10001").wait(3000)
            cy.wait(3000)
            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span").contains("SER-10001")
            cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").clear()
            cy.wait(2000)
        });
    })

    //IT- Change the status as Active or Inactive 
    it("As A Org Admin I should be able to Change the status of Service As Active and Inactive", () => {
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click();
        cy.wait(2000);
        cy.get(".sidebar-menu-list > :nth-child(2) > .ant-menu-item > a").click();
        cy.wait(2000);
        cy.get(".title-container").contains("Services");
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
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(8) > span > span > nz-tag").contains("INACTIVE");
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(8) > span > span > nz-tag").contains("INACTIVE");
        cy.get("table > tbody > tr:nth-child(3) > td:nth-child(8) > span > span > nz-tag").contains("INACTIVE");
        //check the filter active/inactive
        cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click();
        cy.get("ul > li:nth-child(2) > label > span.ant-checkbox > input").check();
        cy.get("div > div > div > a.ant-table-filter-dropdown-link.confirm > span").click();
        //verify the filterd list
        cy.wait(2000);
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(8) > span > span > nz-tag").contains("INACTIVE");
        //to reset the filter
        cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click();
        cy.get(".clear > span").click();
        cy.wait(2000)
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
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(8) > span > span > nz-tag").contains("ACTIVE");
    })

})
