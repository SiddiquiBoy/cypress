///<reference types="Cypress"/>

const data = require('../../../../fixtures/data.json')

describe("Listing Timesheet Code", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })

    //IT- Navigate to the listing  Page
    it("As a Org Admin, navigate to the Timesheet code Page", function () {
        cy.wait(1000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")
    });

    //IT- verify the searching functionlity 
    it("As a Org admin I should be able to search any Timesheet code  by search bar", function () {
        cy.wait(1000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")


        cy.get('.table-action-list > .search-bar-container > app-searchbar > .header-search-bar > .ant-input-affix-wrapper > .ant-input')
            .should('be.visible')
            .clear()
            .type('10000')
            .wait(2000)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(2) > span").contains('10000')
        cy.get('.table-action-list > .search-bar-container > app-searchbar > .header-search-bar > .ant-input-affix-wrapper > .ant-input')
            .should('be.visible')
            .clear()
            .wait(2000)

    });

    //IT- verify the action dropdown Active/Inactive functionality 
    it("As a Org admin I can change the status of timesheet code as ACTIVE or INACTIVE", function () {
        cy.wait(1000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")

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
        cy.wait(1000)
        cy.get("section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost").click()
        cy.get('section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost').trigger('mouseover')
        cy.get('.ant-dropdown-menu > :nth-child(1) > a').click()
        cy.contains("Please select a row to change the status")
        cy.wait(2000)

        // select specific rows to deactivate 
        cy.get("table > tbody > tr:nth-child(1) > td.ant-table-selection-column.ng-star-inserted > label > span.ant-checkbox > input").should('not.be.checked').check()
        cy.get("table > tbody > tr:nth-child(2) > td.ant-table-selection-column.ng-star-inserted > label > span.ant-checkbox > input").should('not.be.checked').check()
        cy.get("table > tbody > tr:nth-child(3) > td.ant-table-selection-column.ng-star-inserted > label > span.ant-checkbox > input").should('not.be.checked').check()

        cy.get("section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost").click()
        cy.get('section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost').trigger('mouseover')
        cy.get('.ant-dropdown-menu > :nth-child(2) > a').click()
        cy.wait(500)
        cy.contains("Status has been successfully updated")
        cy.wait(2000)

        //verify the status of the technician

        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > nz-tag").contains(" INACTIVE")
        cy.get("table > tbody > tr:nth-child(2) > td:nth-child(6) > span > span > nz-tag").contains(" INACTIVE")
        cy.get("table > tbody > tr:nth-child(3) > td:nth-child(6) > span > span > nz-tag").contains(" INACTIVE")


        // select all rows to activate
        cy.get("table > thead > tr > th.ant-table-selection-column.ng-star-inserted > span > div > span > label > span.ant-checkbox > input ").check()
        cy.get("section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost").click()
        cy.get('section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost').trigger('mouseover')
        cy.get('.ant-dropdown-menu > :nth-child(1) > a').click();
        cy.contains("Status has been successfully updated")
        cy.wait(3000)
        cy.get("table > thead > tr > th.ant-table-selection-column.ng-star-inserted > span > div > span > label > span.ant-checkbox > input ").uncheck()
        //verify the status of one Technician
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(6) > span > span > nz-tag").contains("ACTIVE")

    })

})