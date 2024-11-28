describe('Admin Features', () => {
  beforeEach(() => {
    cy.loginByRole('admin');
  });

  describe('Property Management', () => {
    it('can add a new property', () => {
      cy.visit('/admin/properties');
      cy.get('button').contains('Add Property').click();
      cy.get('input[name="name"]').type('Test Property');
      cy.get('input[name="address"]').type('123 Test St');
      cy.get('input[name="rent"]').type('1200');
      cy.get('button').contains('Save').click();
      cy.contains('Property added successfully').should('be.visible');
    });

    it('can edit property details', () => {
      cy.visit('/admin/properties');
      cy.get('[data-testid="property-1"]').within(() => {
        cy.get('button[aria-label="Edit"]').click();
      });
      cy.get('input[name="rent"]').clear().type('1300');
      cy.get('button').contains('Save').click();
      cy.contains('Property updated successfully').should('be.visible');
    });
  });

  describe('Tenant Management', () => {
    it('can assign tenant to property', () => {
      cy.assignTenant('tenant@test.com', 'property-1');
      cy.contains('Tenant assigned successfully').should('be.visible');
    });

    it('can manage tenant roles', () => {
      cy.visit('/admin/tenants');
      cy.get('[data-testid="tenant-role-select"]').select('landlord');
      cy.contains('Role updated successfully').should('be.visible');
    });
  });

  describe('Reports', () => {
    it('can view and export reports', () => {
      cy.visit('/admin/reports');
      cy.get('select[name="dateRange"]').select('month');
      cy.get('button').contains('Export CSV').click();
      cy.readFile('cypress/downloads/rental-report.csv').should('exist');
    });
  });
});