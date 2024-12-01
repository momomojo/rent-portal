import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '@shared/hooks/useAuthState';
import { signIn, signUp } from '../store/authSlice';
import { AppDispatch } from '@core/store';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/SelectNew';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { PasswordRequirements } from './PasswordRequirements';
import { validatePassword } from '../utils/passwordValidation';
import debounce from 'lodash/debounce';
import { useRateLimitedAuth } from '@core/hooks/useRateLimitedAuth';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useAuthState();
  const { isBlocked, checkRateLimit } = useRateLimitedAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    role: 'tenant'
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const debouncedValidation = useCallback(
    debounce((password: string) => {
      const { errors } = validatePassword(password);
      setValidationErrors(errors);
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));

    if (name === 'password') {
      debouncedValidation(value as string);
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkRateLimit(formData.email)) {
      return;
    }

    try {
      if (type === 'login') {
        await dispatch(signIn({ 
          email: formData.email, 
          password: formData.password 
        })).unwrap();
        navigate('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        const { isValid, errors } = validatePassword(formData.password);
        if (!isValid) {
          throw new Error(errors[0]);
        }

        await dispatch(signUp({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          role: formData.role
        })).unwrap();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {type === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <Alert variant="destructive">{error}</Alert>}
          {isBlocked && (
            <Alert variant="warning">
              Too many login attempts. Please try again later.
            </Alert>
          )}
          
          <div className="space-y-4">
            {type === 'register' && (
              <Input
                required
                id="displayName"
                label="Full Name"
                name="displayName"
                autoComplete="name"
                value={formData.displayName}
                onChange={handleChange}
              />
            )}
            
            <Input
              required
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            
            <Input
              required
              type="password"
              id="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setShowPasswordRequirements(true)}
              error={validationErrors.length > 0}
              helperText={validationErrors[0] || ''}
            />
            
            {type === 'register' && (
              <>
                <PasswordRequirements 
                  password={formData.password} 
                  showValidation={showPasswordRequirements}
                />
                
                {formData.password && (
                  <PasswordStrengthIndicator password={formData.password} />
                )}
                
                <Input
                  required
                  type="password"
                  id="confirmPassword"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                  helperText={
                    formData.password !== formData.confirmPassword && formData.confirmPassword !== ''
                      ? 'Passwords do not match'
                      : ''
                  }
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Role
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="landlord">Landlord</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={isBlocked}
          >
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
