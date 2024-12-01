import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import React from 'react';
import { Alert } from './Alert';

/**
 * Alert component provides contextual feedback messages for user actions.
 * 
 * Accessibility:
 * - Uses role="alert" for important messages
 * - Uses role="status" for non-critical updates
 * - Includes aria-live regions for dynamic content
 * - Supports keyboard dismissal
 * 
 * Testing:
 * - Unit tests for rendering variants
 * - Integration tests for dismissal behavior
 * - Accessibility tests for ARIA attributes
 * - Visual regression tests for styles
 */
const meta = {
    title: 'UI/Alert',
    component: Alert,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Alert component for displaying important messages and notifications.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['info', 'success', 'warning', 'error'],
        },
        dismissible: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'This is an alert message',
        variant: 'info',
    },
};

export const Variants: Story = {
    render: () => (
        <div className="w-[400px] space-y-4">
            <Alert variant="info">
                <Info className="h-4 w-4" />
                <span>New property listings available in your area</span>
            </Alert>
            <Alert variant="success">
                <CheckCircle className="h-4 w-4" />
                <span>Your rent payment was successfully processed</span>
            </Alert>
            <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <span>Your rent payment is due in 3 days</span>
            </Alert>
            <Alert variant="error">
                <XCircle className="h-4 w-4" />
                <span>Failed to submit maintenance request</span>
            </Alert>
        </div>
    ),
};

export const Dismissible: Story = {
    render: () => (
        <div className="w-[400px] space-y-4">
            <Alert variant="info" dismissible>
                <Info className="h-4 w-4" />
                <span>Click the X button to dismiss this alert</span>
            </Alert>
            <Alert variant="success" dismissible>
                <CheckCircle className="h-4 w-4" />
                <span>This success message can be dismissed</span>
            </Alert>
        </div>
    ),
};

export const WithActions: Story = {
    render: () => (
        <div className="w-[400px] space-y-4">
            <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <div className="flex-1">
                    <h4 className="mb-1 font-medium">Payment Reminder</h4>
                    <p className="text-sm">Your rent payment is due soon.</p>
                    <div className="mt-2">
                        <button className="mr-2 text-sm font-medium underline">
                            Pay Now
                        </button>
                        <button className="text-sm text-gray-600">
                            Remind Me Later
                        </button>
                    </div>
                </div>
            </Alert>
            <Alert variant="error">
                <XCircle className="h-4 w-4" />
                <div className="flex-1">
                    <h4 className="mb-1 font-medium">Failed to Upload Document</h4>
                    <p className="text-sm">The file size exceeds the maximum limit.</p>
                    <div className="mt-2">
                        <button className="mr-2 text-sm font-medium underline">
                            Try Again
                        </button>
                        <button className="text-sm text-gray-600">
                            View Requirements
                        </button>
                    </div>
                </div>
            </Alert>
        </div>
    ),
};

export const RealWorldExamples: Story = {
    render: () => (
        <div className="w-[400px] space-y-4">
            {/* Payment Success */}
            <Alert variant="success" dismissible>
                <CheckCircle className="h-4 w-4" />
                <div className="flex-1">
                    <h4 className="mb-1 font-medium">Payment Successful</h4>
                    <p className="text-sm">
                        Your rent payment of $1,500 has been processed.
                        <br />
                        Transaction ID: #123456
                    </p>
                    <button className="mt-2 text-sm font-medium underline">
                        View Receipt
                    </button>
                </div>
            </Alert>

            {/* Maintenance Update */}
            <Alert variant="info">
                <Info className="h-4 w-4" />
                <div className="flex-1">
                    <h4 className="mb-1 font-medium">Maintenance Update</h4>
                    <p className="text-sm">
                        Your request #1234 has been scheduled.
                        <br />
                        Technician will arrive on June 15, 2024
                    </p>
                    <div className="mt-2 space-x-3">
                        <button className="text-sm font-medium underline">
                            View Details
                        </button>
                        <button className="text-sm text-gray-600">
                            Reschedule
                        </button>
                    </div>
                </div>
            </Alert>

            {/* Lease Expiration */}
            <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <div className="flex-1">
                    <h4 className="mb-1 font-medium">Lease Expiring Soon</h4>
                    <p className="text-sm">
                        Your lease expires in 30 days.
                        <br />
                        Please renew or provide move-out notice.
                    </p>
                    <div className="mt-2 space-x-3">
                        <button className="text-sm font-medium underline">
                            Renew Lease
                        </button>
                        <button className="text-sm text-gray-600">
                            Submit Notice
                        </button>
                    </div>
                </div>
            </Alert>

            {/* Document Verification */}
            <Alert variant="error">
                <AlertCircle className="h-4 w-4" />
                <div className="flex-1">
                    <h4 className="mb-1 font-medium">Document Verification Failed</h4>
                    <p className="text-sm">
                        Your proof of income document was rejected.
                        <br />
                        Reason: Image quality too low
                    </p>
                    <div className="mt-2 space-x-3">
                        <button className="text-sm font-medium underline">
                            Upload New Document
                        </button>
                        <button className="text-sm text-gray-600">
                            View Requirements
                        </button>
                    </div>
                </div>
            </Alert>
        </div>
    ),
};

export const AccessibleExample: Story = {
    render: () => (
        <div className="w-[400px] space-y-4">
            <div
                role="alert"
                aria-live="assertive"
                className="space-y-4"
            >
                <Alert variant="error">
                    <AlertCircle className="h-4 w-4" />
                    <span>Critical: Your payment is overdue</span>
                </Alert>
            </div>

            <div
                role="status"
                aria-live="polite"
                className="space-y-4"
            >
                <Alert variant="info">
                    <Info className="h-4 w-4" />
                    <span>Information: New amenities added to your building</span>
                </Alert>
            </div>
        </div>
    ),
};
