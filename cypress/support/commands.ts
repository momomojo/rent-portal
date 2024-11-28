/// <reference types="cypress" />
import 'cypress-file-upload';
import 'cypress-firebase';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginByRole(role: 'admin' | 'landlord' | 'tenant'): Chainable<void>;
      createMaintenanceRequest(title: string, description: string): Chainable<void>;
      uploadDocument(filePath: string, type: string): Chainable<void>;
      makePayment(amount: number): Chainable<void>;
      assignTenant(tenantEmail: string, propertyId: string): Chainable<void>;
    }
  }
}

// Authentication commands
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('loginByRole', (role) => {
  const credentials = {
    admin: { email: 'admin@test.com', password: 'password123' },
    landlord: { email: 'landlord@test.com', password: 'password123' },
    tenant: { email: 'tenant@test.com', password: 'password123' },
  };
  cy.login(credentials[role].email, credentials[role].password);
});

// Maintenance commands
Cypress.Commands.add('createMaintenanceRequest', (title: string, description: string) => {
  cy.visit('/maintenance');
  cy.get('button').contains('New Request').click();
  cy.get('input[name="title"]').type(title);
  cy.get('textarea[name="description"]').type(description);
  cy.get('button[type="submit"]').click();
});

// Document commands
Cypress.Commands.add('uploadDocument', (filePath: string, type: string) => {
  cy.visit('/documents');
  cy.get('button').contains('Upload Document').click();
  cy.get('select[name="type"]').select(type);
  cy.get('input[type="file"]').attachFile(filePath);
  cy.get('button').contains('Upload').click();
});

// Payment commands
Cypress.Commands.add('makePayment', (amount: number) => {
  cy.visit('/payments');
  cy.get('button').contains('Make Payment').click();
  cy.get('input[name="amount"]').type(amount.toString());
  cy.get('[data-testid="card-element"]').within(() => {
    cy.fillElementsInput('cardNumber', '4242424242424242');
    cy.fillElementsInput('cardExpiry', '1234');
    cy.fillElementsInput('cardCvc', '123');
  });
  cy.get('button').contains('Pay Now').click();
});

// Admin commands
Cypress.Commands.add('assignTenant', (tenantEmail: string, propertyId: string) => {
  cy.visit('/admin/tenants');
  cy.get(`[data-testid="tenant-${tenantEmail}"]`).within(() => {
    cy.get('select[name="property"]').select(propertyId);
    cy.get('button').contains('Assign').click();
  });
});