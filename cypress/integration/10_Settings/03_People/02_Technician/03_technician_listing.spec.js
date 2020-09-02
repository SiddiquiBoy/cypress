///<reference types="Cypress"/>
import faker, { phone } from "faker";
import "cypress-file-upload";

const data = require("../../../../fixtures/data.json");
describe("Technician listing", function () {
  beforeEach("Login", () => {
    cy.login(data.base_url, data.OrgAdmin_username, data.OrgAdmin_password)
  })
  afterEach("Logout", () => {
    cy.logout()
  })

  //IT- Navigate to the Technician Page
  it("As a Org Admin, navigate to the Technician Page", function () {

    cy.wait(1000)
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(':nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a').click();
    cy.wait(2000);
    cy.get("section > app-page-header > section > section.title-content-container > section").contains("Technicians");
  });

  //IT- verify the searching functionlity 
  it("As a Org admin I should be able to search any employee by search bar", function () {
    cy.wait(1000)
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(':nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a').click();
    cy.wait(2000);
    cy.get("section > app-page-header > section > section.title-content-container > section").contains("Technicians");
    //read technician.json file
    cy.readFile("technician.json").then((data) => {

      cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").should('be.visible').type(data.fname);
      cy.wait(2000)
      cy.get("table > tbody > tr:nth-child(1) >td:nth-child(2)").should("contain.text", data.fname + " " + data.lname);

      cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").should('be.visible').clear().wait(2000).type(data.email);
      cy.wait(2000)
      cy.get("table > tbody > tr:nth-child(1) >td:nth-child(4) > span").contains(data.email);

      const phone = data.office_phone.replace(/[^\d]/g, "");
      cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").should('be.visible').clear().wait(2000).type(phone);
      cy.wait(2000)
      cy.get("table > tbody > tr:nth-child(1) >td:nth-child(3) > span").contains(data.office_phone);
      cy.get("div > section > section.search-bar-container.ng-star-inserted > app-searchbar > section > nz-input-group > input").should('be.visible').clear()
      cy.wait(2000)
    });
  });

  //IT- verify the action dropdown Active/Inactive functionality 
  it("As a Org admin I can change the status of Technician as ACTIVE or INACTIVE", function () {
    cy.wait(1000)
    cy.get(".setting-position > a").click();
    cy.wait(2000);
    cy.get(" nz-sider > div > ul > section:nth-child(3) > li > div").click();
    cy.wait(2000);
    cy.get(':nth-child(3) > .ant-menu-submenu > .ant-menu > .submenu-item-list > :nth-child(2) > a').click();
    cy.wait(2000);
    cy.get("section > app-page-header > section > section.title-content-container > section").contains("Technicians");

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
    cy.wait(1000)
    cy.contains("Status has been successfully updated")
    cy.wait(2000)

    //verify the status of the technician
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span > nz-tag").contains("INACTIVE ")
    cy.get("table > tbody > tr:nth-child(2) > td:nth-child(7) > span > span > nz-tag").contains("INACTIVE ")
    cy.get("table > tbody > tr:nth-child(3) > td:nth-child(7) > span > span > nz-tag").contains("INACTIVE ")

    //check the filter active/inactive
    cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click()
    cy.get("ul > li:nth-child(2) > label > span.ant-checkbox > input").check()
    cy.get("div > div > div > a.ant-table-filter-dropdown-link.confirm > span").click()
    //verify the filterd list
    cy.wait(2000)
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span > nz-tag").contains("INACTIVE ")
    //to reset the filter
    cy.get("table > thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters.ng-star-inserted > i").click()
    cy.get('.clear > span').click()

    // select all rows to activate
    cy.get("table > thead > tr > th.ant-table-selection-column.ng-star-inserted > span > div > span > label > span.ant-checkbox > input ").check()
    cy.get("section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost").click()
    cy.get('section > section.buttons-container.ng-star-inserted > button.flex-center.ant-btn.ant-dropdown-trigger.ng-star-inserted.ant-btn-primary.ant-btn-background-ghost').trigger('mouseover')
    cy.get('.ant-dropdown-menu > :nth-child(1) > a').click();
    cy.contains("Status has been successfully updated")
    cy.wait(3000)
    cy.get("table > thead > tr > th.ant-table-selection-column.ng-star-inserted > span > div > span > label > span.ant-checkbox > input ").uncheck()
    //verify the status of one Technician
    cy.get("table > tbody > tr:nth-child(1) > td:nth-child(7) > span > span > nz-tag").contains("ACTIVE ")

  })
});
