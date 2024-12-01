import { validatePassword } from '../utils/passwordValidation';

describe('Password Validation', () => {
  test('should validate minimum length', () => {
    const shortPassword = 'short';
    const result = validatePassword(shortPassword);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  test('should validate maximum length', () => {
    const longPassword = 'a'.repeat(129);
    const result = validatePassword(longPassword);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be less than 128 characters');
  });

  test('should validate character requirements', () => {
    const weakPassword = 'onlylowercase';
    const result = validatePassword(weakPassword);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
    expect(result.errors).toContain('Password must contain at least one number');
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  test('should identify strong password', () => {
    const strongPassword = 'StrongP@ssw0rd';
    const result = validatePassword(strongPassword);
    expect(result.isValid).toBe(true);
    expect(result.strength).toBe('strong');
    expect(result.errors).toHaveLength(0);
  });

  test('should calculate password strength score', () => {
    const passwords = [
      { value: 'weak', expectedStrength: 'weak' },
      { value: 'Password1', expectedStrength: 'medium' },
      { value: 'StrongP@ssw0rd', expectedStrength: 'strong' }
    ];

    passwords.forEach(({ value, expectedStrength }) => {
      const result = validatePassword(value);
      expect(result.strength).toBe(expectedStrength);
    });
  });

  test('should handle empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });
});
