import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';

const Payments: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payments
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {user?.role === 'tenant' ? 'Make a Payment' : 'Payment Overview'}
            </Typography>
            
            {/* Placeholder for payment form or payment history */}
            <Box sx={{ mt: 2 }}>
              <Typography color="text.secondary">
                {user?.role === 'tenant'
                  ? 'Make secure payments and view your payment history here.'
                  : 'Track and manage payments from your tenants.'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Payments;
