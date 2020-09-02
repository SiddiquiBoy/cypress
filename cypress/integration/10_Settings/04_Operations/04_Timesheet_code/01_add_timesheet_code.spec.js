///<reference types="Cypress"/>

const data = require('../../../../fixtures/data.json')


describe("Add Timesheet Code", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
    })
    afterEach("Logout", () => {
        cy.logout()
    })
    
    it("As a Admin I should be able to navigate on timesheet code page", () => {
        cy.wait(1000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")
    })
    

    it("At Add Timesheet code page labels should be proper", () => {
        
        cy.wait(1000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")
        cy.get('.ml-10').click()
        cy.wait(2000)
        cy.get('.title-container').contains('Add a Timesheet Code')
        //cy.get('.ant-form > :nth-child(1) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Timesheet Code");
        cy.get('form > div:nth-child(1) > div:nth-child(1) > nz-form-item > nz-form-label > label').contains("Type");
        cy.get('form > div:nth-child(1) > div.ant-col.ant-col-12.ng-star-inserted > nz-form-item > nz-form-label > label').contains("Status");
        cy.get('form > div:nth-child(2) > div > nz-form-item > nz-form-label > label').contains("Master Pay File Business Units");
        cy.get('form > nz-form-item:nth-child(3) > nz-form-label > label').contains("Description");
        //cy.go("back")
    })
    
    it("At Add Timesheet code page each field should have proper validation", () => {
        cy.wait(1000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")
        cy.get('.ml-10').click()
        cy.wait(2000)
        cy.get('div > section > app-page-header > section > section.title-content-container > section').contains('Add a Timesheet Code')
        cy.get('form > nz-form-item:nth-child(3) > nz-form-control > div > span > textarea').type("desc").clear();
        cy.contains("Enter Item Description");
       // cy.go('back');
    })
    

    it("As a Admin I should be able to add new timesheet code page", () => {
        cy.wait(1000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")
        cy.get('.ml-10').click()
        cy.wait(2000)
        cy.get('div > section > app-page-header > section > section.title-content-container > section').contains('Add a Timesheet Code')
        const type = "Paid";
        const master_pay_bu = "Jacey";
        const status = "Active";
        cy.Timesheet_Code_form(type, master_pay_bu);
        cy.wait(500)
        //cy.contains("Timesheet Code added successfully");
        cy.contains("Timesheet Code has been successfully added");
        cy.wait(1000)
        cy.get('.title-container').contains("Timesheet Codes");
        cy.verify_timesheet_code_data(status)
    })
    

    it("At Add Timesheet code verify the cancel functionality", () => {
        cy.wait(1000)
        cy.get('.setting-position > a').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu-submenu-title').click()
        cy.get(':nth-child(4) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(4) > a').click()
        cy.wait(2000)
        cy.get('.title-container').contains("Timesheet Codes")
        cy.get('.ml-10').click()
        cy.wait(2000)
        cy.get('div > section > app-page-header > section > section.title-content-container > section').contains('Add a Timesheet Code');
        cy.get('.link').click();
        cy.get('.title-container').contains("Timesheet Codes");
        
    })
    
})
