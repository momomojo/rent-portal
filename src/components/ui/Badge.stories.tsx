import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Check, X, AlertTriangle, Clock } from 'lucide-react';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// Real world examples
export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Badge variant="default" className="flex items-center gap-1">
        <Check className="h-3 w-3" />
        Active
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
      <Badge variant="destructive" className="flex items-center gap-1">
        <X className="h-3 w-3" />
        Inactive
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Warning
      </Badge>
    </div>
  ),
};

export const PropertyTags: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Badge variant="secondary">Available</Badge>
      <Badge variant="default">Pet Friendly</Badge>
      <Badge variant="outline">Furnished</Badge>
      <Badge variant="secondary">Parking</Badge>
      <Badge variant="outline">Utilities Included</Badge>
    </div>
  ),
};

export const PaymentStatus: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Badge variant="default" className="flex items-center gap-1">
        <Check className="h-3 w-3" />
        Paid
      </Badge>
      <Badge variant="destructive" className="flex items-center gap-1">
        <X className="h-3 w-3" />
        Overdue
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Processing
      </Badge>
      <Badge variant="outline">Partial Payment</Badge>
    </div>
  ),
};

export const MaintenanceStatus: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Badge variant="destructive">High Priority</Badge>
      <Badge variant="secondary">In Progress</Badge>
      <Badge variant="outline">Scheduled</Badge>
      <Badge variant="default">Completed</Badge>
    </div>
  ),
};

export const NotificationBadges: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Badge variant="destructive">3 Alerts</Badge>
      <Badge variant="secondary">5 Messages</Badge>
      <Badge variant="outline">2 Updates</Badge>
      <Badge variant="default">New</Badge>
    </div>
  ),
};
