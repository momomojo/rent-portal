describe('Maintenance System', () => {
  describe('Tenant Maintenance Requests', () => {
    beforeEach(() => {
      cy.loginByRole('tenant');
    });

    it('can submit maintenance request with images', () => {
      cy.visit('/maintenance');
      cy.get('button').contains('New Request').click();
      cy.get('input[name="title"]').type('Broken Faucet');
      cy.get('textarea[name="description"]').type('Kitchen faucet is leaking');
      cy.get('select[name="priority"]').select('high');
      cy.get('input[type="file"]').attachFile('leak.jpg');
      cy.get('button[type="submit"]').click();
      cy.contains('Request submitted successfully').should('be.visible');
    });

    it('can track request status', () => {
      cy.visit('/maintenance');
      cy.get('[data-testid="maintenance-list"]').should('exist');
      cy.get('[data-testid="status-badge"]').should('be.visible');
    });
  });

  describe('Landlord Maintenance Management', () => {
    beforeEach(() => {
      cy.loginByRole('landlord');
    });

    it('can assign vendor to request', () => {
      cy.visit('/maintenance');
      cy.get('[data-testid="request-1"]').within(() => {
        cy.get('button').contains('Assign Vendor').click();
      });
      cy.get('select[name="vendor"]').select('Plumber');
      cy.get('input[name="scheduledDate"]').type('2024-03-01');
      cy.get('button').contains('Assign').click();
      cy.contains('Vendor assigned successfully').should('be.visible');
    });

    it('can update request status', () => {
      cy.visit('/maintenance');
      cy.get('[data-testid="request-1"]').within(() => {
        cy.get('select[name="status"]').select('completed');
      });
      cy.contains('Status updated successfully').should('be.visible');
    });
  });
});