describe('Notification System', () => {
  describe('User Notifications', () => {
    beforeEach(() => {
      cy.loginByRole('tenant');
    });

    it('displays payment due notifications', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="notification-center"]').click();
      cy.contains('Payment Due').should('be.visible');
    });

    it('can mark notifications as read', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="notification-center"]').click();
      cy.get('[data-testid="notification-1"]').within(() => {
        cy.get('button[aria-label="Mark as read"]').click();
      });
      cy.contains('Notification marked as read').should('be.visible');
    });

    it('can navigate through notification actions', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="notification-center"]').click();
      cy.get('[data-testid="notification-1"]').within(() => {
        cy.get('button').contains('Pay Now').click();
      });
      cy.url().should('include', '/payments');
    });
  });

  describe('Notification Preferences', () => {
    it('can update notification preferences', () => {
      cy.visit('/profile');
      cy.get('button').contains('Notification Preferences').click();
      cy.get('input[name="email-notifications"]').check();
      cy.get('button').contains('Save Preferences').click();
      cy.contains('Preferences updated successfully').should('be.visible');
    });
  });
});