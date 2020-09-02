///<reference types="Cypress"/>

const data = require("../../fixtures/data.json");

context(
  "An Organization Admin can Reset the Password, receives the confirmation email and logins successfully",
  () => {
    //It - An Organization Admin can Reset Password successfully
    it("An Organization Admin can Reset Password successfully", () => {
      cy.visit(data.OrgAdmin_url);
      cy.get(".login-form-forgot")
        .should("be.visible")
        .contains("Forgot password")
        .click();

      // Admin enters email and submits to reset the password
      cy.get("#forgot-password-title").contains("Forgot Password");
      cy.get("p.text-center").contains(
        " Don't worry! Resetting your password is easy. "
      );
      cy.get("p.text-center").contains(
        " Just type in your registered email id "
      );
      cy.get(".login-form-button").should("not.be.enabled");
      cy.get(".ant-input").type(data.OrgAdmin_username);
      cy.get(".login-form-button").should("be.enabled");

      // Gets the confirmation email
      /* Submit the email, change the password /*

      // Login  and Logout successfully with new credentials
      /* Login successfully */
      /* Logout successfully*/
    });
  }
);
