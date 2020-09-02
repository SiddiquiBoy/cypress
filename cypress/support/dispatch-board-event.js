import faker from "faker";

Cypress.Commands.add("Add_Dispatch_Board_Event_Form", () => {

    const event_name = faker.random.words()
    const timesheet_code = "TMS-10000"
    const technician = "Christian Schinner"
    const start_time = "13:13:13"
    const end_time = "16:13:13"

    cy.writeFile("dispatchBoardEvent.json", {
        name: event_name,
        timeSheetCode: timesheet_code,
        technician: technician,
        startTime: start_time,
        endTime: end_time,
    });

    cy.get("#eventName").should('be.visible').clear().type(event_name)
    cy.get("#timesheetCode").click()
    cy.get('.ant-select-dropdown-menu >').contains(timesheet_code).click()
    cy.get("#technician").click()
    cy.get('.ant-select-dropdown-menu >').contains(technician).click()
    cy.get("#startTime > .ant-time-picker-input").should('be.visible').click()
    cy.get('.ant-time-picker-panel-input-wrap').type(start_time)
    cy.get('.cdk-overlay-backdrop').click({ force: true })
    cy.get("#endTime > .ant-time-picker-input").should('be.visible').click()
    cy.get('.ant-time-picker-panel-input-wrap').type(end_time)
    cy.get('.cdk-overlay-backdrop').click({ force: true })
})