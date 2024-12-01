export const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128
};

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let strengthScore = 0;

  // Length checks
  if (password.length < passwordRequirements.minLength) {
    errors.push(`Password must be at least ${passwordRequirements.minLength} characters`);
  }
  if (password.length > passwordRequirements.maxLength) {
    errors.push(`Password must not exceed ${passwordRequirements.maxLength} characters`);
  }

  // Character type checks
  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strengthScore++;
  }

  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strengthScore++;
  }

  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strengthScore++;
  }

  if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    strengthScore++;
  }

  // Additional strength checks
  if (password.length >= 12) strengthScore++;
  if (password.length >= 16) strengthScore++;

  // Determine password strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (strengthScore >= 5) {
    strength = 'strong';
  } else if (strengthScore >= 3) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};
