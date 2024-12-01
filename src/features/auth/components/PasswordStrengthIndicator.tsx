import React from 'react';
import { validatePassword } from '../utils/passwordValidation';
import { Typography } from '@/components/ui/Typography';
import { LinearProgress } from '@/components/ui/LinearProgress';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { score, feedback } = validatePassword(password);
  const scorePercentage = (score / 4) * 100;

  const getColorByScore = (score: number) => {
    if (score <= 1) return 'destructive';
    if (score <= 2) return 'warning';
    if (score <= 3) return 'primary';
    return 'success';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Typography variant="small" className="text-muted-foreground">
          Password Strength
        </Typography>
        <Typography variant="small" className={`text-${getColorByScore(score)}`}>
          {score <= 1 ? 'Weak' : score <= 2 ? 'Fair' : score <= 3 ? 'Good' : 'Strong'}
        </Typography>
      </div>
      <LinearProgress
        value={scorePercentage}
        variant={getColorByScore(score)}
      />
      {feedback && (
        <Typography variant="small" className="text-muted-foreground">
          {feedback}
        </Typography>
      )}
    </div>
  );
};
