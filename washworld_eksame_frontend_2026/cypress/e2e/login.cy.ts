describe("Login", () => {
  it("logs in with valid credentials and lands on dashboard", () => {
    cy.visit("http://localhost:3000/pages/login");
    cy.get('input[name="user_email"]').type("c.koudal@gmail.com");//sophia.anina@gmail.com
    cy.get('input[name="user_password"]').type("qwertyU12");//50591108
    cy.get('button[type="button"]').click();
    cy.url().should("include", "/pages/dashboard");
  });

  it("shows error with invalid credentials", () => {
    cy.visit("http://localhost:3000/pages/login");
    cy.get('input[name="user_email"]').type("wrong@email.com");
    cy.get('input[name="user_password"]').type("wrongpassword");
    cy.get('button[type="button"]').click();
    cy.contains("User doesn't exist").should("be.visible");  }); // changed Login failed to User doesn't exist
});