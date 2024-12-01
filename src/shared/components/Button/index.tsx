import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  fullWidth?: boolean;
  loading?: boolean;
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  '&.MuiButton-containedPrimary': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

export const Button: React.FC<ButtonProps> = ({
  children,
  color = 'primary',
  variant = 'contained',
  fullWidth = false,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      color={color}
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
};

export default Button;
