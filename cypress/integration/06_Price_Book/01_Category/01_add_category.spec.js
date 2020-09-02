///<reference types="Cypress"/>
const data = require('../../../fixtures/data.json')
import "cypress-file-upload";

describe("Add Category", () => {
    beforeEach("Login", () => {
        cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
      })
      afterEach("Logout", () => {
        cy.logout()
      })
      
    //IT- Navigate on Category page 
    it("As a Org Admin I should be able to navigate on Category page", () => {
       
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Categories ")
        cy.get("section > app-page-header > section > section.description-content-container > section").contains(" Manage the categories of your services. ")
    })
    
    //IT- check lebals 
    it("Add Category page should have proper lebals", () => {
        
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Categories ")
        cy.get("section > app-page-header > section > section.description-content-container > section").contains(" Manage the categories of your services. ")
        cy.get(".ml-10").click()
        cy.wait(1000)
        cy.get("section > section.title-content-container > section").contains(" Add Category ")
        cy.get('.ant-col-16 > :nth-child(1) > .ant-form-item-label > .ant-form-item-required').contains("Name")
        cy.get('.ant-col-16 > :nth-child(2) > :nth-child(1) > .ant-form-item > .ant-form-item-label > .ant-form-item-required').contains("Business Unit")
        cy.get('form > div > div.ant-col.ant-col-16 > div:nth-child(2) > div.ant-col.ant-col-12.ng-star-inserted > nz-form-item > nz-form-label > label').contains("Services")
        cy.get('form > div > div.ant-col.ant-col-16 > div:nth-child(3) > div > div > nz-form-item > nz-form-label > label').contains("Status")
        cy.get('.ant-upload-text').contains(" Upload Category Image ")
        //cy.go('back');
    })

    //IT- Check validation 
    it("Add Category page each field should have proper validations", () => {
        
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Categories ")
        cy.get("section > app-page-header > section > section.description-content-container > section").contains(" Manage the categories of your services. ")
        cy.get(".ml-10").click()
        cy.wait(1000)
        cy.get("section > section.title-content-container > section").contains(" Add Category ")
        cy.get('#name').should("be.visible").clear().type("name").clear()
        cy.contains("Invalid/Duplicate Name")
        //cy.go("back")
    })
    
    //IT- Add new Category 
    it("As a Org Admin I should be able to add New Category", () => {
        
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Categories ")
        cy.get("section > app-page-header > section > section.description-content-container > section").contains(" Manage the categories of your services. ")
        cy.wait(1000)
        cy.get(".ml-10").click()
        cy.wait(1000)
        cy.get("section > section.title-content-container > section").contains(" Add Category ")
        const BU = "Jackson";
        const service = "Gorgeous Steel Bacon";
        const status = "Active";
        cy.Category_form(BU, service);
        cy.get('.cdk-overlay-backdrop').click()
        cy.get('.mr-auto').click();
        cy.wait(500)
        cy.contains("Category has been successfully added");
        cy.Verify_Category_data(status);
    })
    
        
    //IT- upload image 
    it("As a Org Admin I should be able to upload Category image", () => {
        
        cy.wait(2000)
        cy.get('[ng-reflect-nz-title="Price Book"] > a').click()
        cy.wait(1000)
        cy.get("section > app-page-header > section > section.title-content-container > section").contains(" Categories ")
        cy.get("section > app-page-header > section > section.description-content-container > section").contains(" Manage the categories of your services. ")
        cy.wait(1000)
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span > a > i").click();
        cy.wait(1000)
        cy.get("div > section.page-header-container > app-page-header > section > section.title-content-container > section").contains(" Edit Category ")
        //cy.get("section > nz-spin > div > section.mt-5.category-form-container > form > div > div.ant-col.ant-col-8 > div > div > app-file-upload > nz-spin > div > nz-upload > nz-upload-list > div > i").click({ force: true })
        cy.wait(2000);
        const imagePath = data.image_path;
        // cy.get('.ant-upload-drag > .ant-upload').click();
        cy.wait(1500);
        cy.get('.ant-upload-drag > .ant-upload').attachFile(imagePath, { subjectType: "drag-n-drop", });
        var i = 0;
        for (i = 0; i < 3; i++) {
            cy.wait(20000);
        }
        cy.get(".ant-form-item-children > .mr-auto").click();
        cy.wait(800);
        cy.contains("Category has been successfully updated");
        cy.wait(500);
        cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span > a > i").click();
        cy.wait(1000)
        cy.get("div > section.page-header-container > app-page-header > section > section.title-content-container > section").contains(" Edit Category ")
        cy.get("div > app-file-upload > nz-spin > div > nz-upload > nz-upload-list > div > div > span > span").should("be.visible")

    })
    

})
