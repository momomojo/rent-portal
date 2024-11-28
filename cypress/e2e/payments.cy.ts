describe('Payment System', () => {
  describe('Tenant Payments', () => {
    beforeEach(() => {
      cy.loginByRole('tenant');
    });

    it('can make a full rent payment', () => {
      cy.makePayment(1200);
      cy.contains('Payment successful').should('be.visible');
      cy.contains('Receipt generated').should('be.visible');
    });

    it('can make a partial payment', () => {
      cy.visit('/payments');
      cy.get('button').contains('Make Payment').click();
      cy.get('input[name="amount"]').type('600');
      cy.get('button').contains('Make Partial Payment').click();
      cy.contains('Partial payment processed').should('be.visible');
    });

    it('can view payment history', () => {
      cy.visit('/payments');
      cy.get('[data-testid="payment-history"]').should('exist');
      cy.get('[data-testid="payment-item"]').should('have.length.at.least', 1);
    });

    it('can enable autopay', () => {
      cy.visit('/payments');
      cy.get('button').contains('Enable AutoPay').click();
      cy.get('input[name="autoPayDay"]').type('1');
      cy.get('button').contains('Save').click();
      cy.contains('AutoPay enabled').should('be.visible');
    });
  });

  describe('Landlord Payment Management', () => {
    beforeEach(() => {
      cy.loginByRole('landlord');
    });

    it('can view tenant payment status', () => {
      cy.visit('/payments');
      cy.get('[data-testid="payment-status"]').should('exist');
    });

    it('can generate payment reports', () => {
      cy.visit('/payments');
      cy.get('button').contains('Generate Report').click();
      cy.get('[data-testid="payment-report"]').should('exist');
    });
  });
});