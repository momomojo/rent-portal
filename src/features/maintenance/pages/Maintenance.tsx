import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Typography } from '@/components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const Maintenance: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h3" className="mb-6">
        Maintenance Requests
      </Typography>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {user?.role === 'tenant' ? 'Submit Maintenance Request' : 'Maintenance Requests Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="body1" color="muted">
            {user?.role === 'tenant'
              ? 'Use this section to submit and track your maintenance requests.'
              : 'View and manage maintenance requests from tenants here.'}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maintenance;
