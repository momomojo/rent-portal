import React from 'react';
import { Typography } from '@/components/ui/Typography';
import { LinearProgress } from '@/components/ui/LinearProgress';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const requirements = [
    {
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      text: 'Contains uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      text: 'Contains lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      text: 'Contains number',
      met: /\d/.test(password),
    },
    {
      text: 'Contains special character',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const metCount = requirements.filter(req => req.met).length;
  const strength = (metCount / requirements.length) * 100;

  const getStrengthColor = (strength: number) => {
    if (strength <= 20) return 'error';
    if (strength <= 40) return 'warning';
    if (strength <= 60) return 'info';
    if (strength <= 80) return 'primary';
    return 'success';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Typography variant="body2" className="text-muted-foreground">
          Password Strength
        </Typography>
        <LinearProgress
          value={strength}
          color={getStrengthColor(strength)}
          size="sm"
        />
      </div>

      <div className="space-y-2">
        <Typography variant="body2" className="text-muted-foreground">
          Requirements
        </Typography>
        <ul className="space-y-1">
          {requirements.map((requirement, index) => (
            <li
              key={index}
              className={cn(
                'flex items-center gap-2 text-sm',
                requirement.met ? 'text-success' : 'text-muted-foreground'
              )}
            >
              {requirement.met ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {requirement.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
