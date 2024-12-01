import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete rental application flow', async ({ page }) => {
    // Login
    await page.click('text=Login');
    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'password123');
    await page.click('button:has-text("Sign In")');
    
    // Navigate to rental listings
    await page.click('text=Rentals');
    
    // Select a property
    await page.click('.property-card:first-child');
    
    // Fill application form
    await page.fill('[name=firstName]', 'John');
    await page.fill('[name=lastName]', 'Doe');
    await page.fill('[name=phone]', '123-456-7890');
    await page.click('button:has-text("Submit Application")');
    
    // Verify success message
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('property search and filtering', async ({ page }) => {
    // Use search filters
    await page.click('[data-testid=price-filter]');
    await page.fill('[data-testid=min-price]', '1000');
    await page.fill('[data-testid=max-price]', '2000');
    
    await page.click('[data-testid=beds-filter]');
    await page.click('text=2+ beds');
    
    await page.click('button:has-text("Apply Filters")');
    
    // Verify filtered results
    const listings = page.locator('.property-card');
    await expect(listings).toHaveCount(await listings.count());
  });

  test('payment processing flow', async ({ page }) => {
    // Login first
    await page.click('text=Login');
    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'password123');
    await page.click('button:has-text("Sign In")');
    
    // Navigate to payments
    await page.click('text=Payments');
    
    // Add payment method
    await page.click('text=Add Payment Method');
    await page.fill('[name=cardNumber]', '4242424242424242');
    await page.fill('[name=expiry]', '12/25');
    await page.fill('[name=cvc]', '123');
    await page.click('button:has-text("Save Card")');
    
    // Make a payment
    await page.click('text=Pay Now');
    await page.click('button:has-text("Confirm Payment")');
    
    // Verify payment success
    await expect(page.locator('.payment-success')).toBeVisible();
  });

  test('document upload and verification', async ({ page }) => {
    // Login
    await page.click('text=Login');
    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'password123');
    await page.click('button:has-text("Sign In")');
    
    // Navigate to documents
    await page.click('text=Documents');
    
    // Upload document
    await page.setInputFiles('input[type="file"]', 'path/to/test-document.pdf');
    
    // Verify upload success
    await expect(page.locator('.upload-success')).toBeVisible();
    
    // Submit for verification
    await page.click('button:has-text("Submit for Verification")');
    
    // Verify submission status
    await expect(page.locator('.verification-pending')).toBeVisible();
  });
});
