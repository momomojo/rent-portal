import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@core/store/types';
import { fetchMaintenanceRequests } from '@features/maintenance/store/maintenanceSlice';
import { MaintenanceRequest } from '@features/maintenance/types';
import { useErrorHandler } from '@core/hooks/useErrorHandler';

export const MaintenanceRequests: React.FC = () => {
  const dispatch = useDispatch();
  const { handleError } = useErrorHandler();
  const { requests, loading, error } = useSelector((state: RootState) => state.maintenance);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        await dispatch(fetchMaintenanceRequests());
      } catch (err) {
        handleError(err);
      }
    };
    loadRequests();
  }, [dispatch, handleError]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error loading maintenance requests. Please try again later.</Typography>
      </Box>
    );
  }

  if (!requests.length) {
    return (
      <Box p={3}>
        <Typography>No maintenance requests found.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Maintenance Requests
      </Typography>
      <Grid container spacing={3}>
        {requests.map((request: MaintenanceRequest) => (
          <Grid item xs={12} sm={6} md={4} key={request.id}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <Typography variant="h6" gutterBottom>
                {request.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {request.description}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={request.status}
                  color={getStatusColor(request.status)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Submitted: {new Date(request.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
