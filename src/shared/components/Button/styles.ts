import { Theme } from '@mui/material/styles';

export const buttonStyles = (theme: Theme) => ({
  root: {
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
  },
});

export default buttonStyles;
