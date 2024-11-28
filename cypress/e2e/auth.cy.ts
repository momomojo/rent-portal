describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('allows user to log in', () => {
    cy.login('test@example.com', 'password123');
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('shows error for invalid credentials', () => {
    cy.login('invalid@example.com', 'wrongpassword');
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('allows user to register', () => {
    cy.visit('/register');
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('select[name="role"]').select('tenant');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('maintains authentication state after page reload', () => {
    cy.login('test@example.com', 'password123');
    cy.reload();
    cy.url().should('include', '/dashboard');
  });
});