describe('Document Management', () => {
  describe('Document Upload and Management', () => {
    beforeEach(() => {
      cy.loginByRole('admin');
    });

    it('can upload a new document', () => {
      cy.uploadDocument('test.pdf', 'lease');
      cy.contains('Document uploaded successfully').should('be.visible');
    });

    it('can create document from template', () => {
      cy.visit('/documents');
      cy.get('button').contains('Use Template').click();
      cy.get('select[name="template"]').select('Lease Agreement');
      cy.get('input[name="name"]').type('New Lease');
      cy.get('button').contains('Create').click();
      cy.contains('Document created successfully').should('be.visible');
    });

    it('can share documents with users', () => {
      cy.visit('/documents');
      cy.get('[data-testid="document-1"]').within(() => {
        cy.get('button[aria-label="Share"]').click();
      });
      cy.get('input[name="users"]').type('tenant@test.com');
      cy.get('button').contains('Share').click();
      cy.contains('Document shared successfully').should('be.visible');
    });

    it('can view document version history', () => {
      cy.visit('/documents');
      cy.get('[data-testid="document-1"]').within(() => {
        cy.get('button[aria-label="History"]').click();
      });
      cy.get('[data-testid="version-history"]').should('exist');
    });
  });

  describe('Document Access Control', () => {
    it('respects user permissions for document access', () => {
      cy.loginByRole('tenant');
      cy.visit('/documents');
      cy.get('[data-testid="shared-documents"]').should('exist');
      cy.get('[data-testid="document-1"]').should('not.exist');
    });
  });
});