import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CircularProgress } from './CircularProgress';

/**
 * CircularProgress component provides visual feedback for loading states.
 * 
 * Accessibility:
 * - Uses role="progressbar"
 * - Includes aria-valuenow, aria-valuemin, and aria-valuemax
 * - Provides aria-label for screen readers
 * - Supports reduced motion preferences
 * 
 * Testing:
 * - Unit tests for progress value calculations
 * - Visual regression tests for animation
 * - Accessibility tests for ARIA attributes
 * - Performance tests for animation smoothness
 */
const meta = {
    title: 'UI/CircularProgress',
    component: CircularProgress,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Circular progress indicator for loading states and progress feedback.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
        },
        value: {
            control: { type: 'range', min: 0, max: 100 },
        },
        indeterminate: {
            control: 'boolean',
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'error', 'warning'],
        },
    },
} satisfies Meta<typeof CircularProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        size: 'md',
        value: 75,
    },
};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <CircularProgress size="sm" value={75} />
            <CircularProgress size="md" value={75} />
            <CircularProgress size="lg" value={75} />
            <CircularProgress size="xl" value={75} />
        </div>
    ),
};

export const Colors: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <CircularProgress color="primary" value={75} />
            <CircularProgress color="secondary" value={75} />
            <CircularProgress color="success" value={75} />
            <CircularProgress color="error" value={75} />
            <CircularProgress color="warning" value={75} />
        </div>
    ),
};

export const States: Story = {
    render: () => (
        <div className="space-y-8">
            {/* Determinate Progress */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Determinate Progress</h3>
                <div className="flex items-center gap-4">
                    <CircularProgress value={25} />
                    <CircularProgress value={50} />
                    <CircularProgress value={75} />
                    <CircularProgress value={100} />
                </div>
            </div>

            {/* Indeterminate Progress */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Indeterminate Progress</h3>
                <div className="flex items-center gap-4">
                    <CircularProgress indeterminate />
                    <CircularProgress indeterminate color="secondary" />
                    <CircularProgress indeterminate color="success" />
                </div>
            </div>
        </div>
    ),
};

export const WithLabel: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <div className="relative">
                <CircularProgress value={75} size="xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium">75%</span>
                </div>
            </div>
            <div className="relative">
                <CircularProgress value={25} size="xl" color="error" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-error">25%</span>
                </div>
            </div>
        </div>
    ),
};

export const RealWorldExamples: Story = {
    render: () => (
        <div className="space-y-8">
            {/* File Upload Progress */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">File Upload</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <CircularProgress value={85} size="lg" color="primary" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium">85%</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Uploading lease_document.pdf</p>
                        <p className="text-xs text-gray-500">8.5 MB / 10 MB</p>
                    </div>
                </div>
            </div>

            {/* Payment Processing */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Payment Processing</h3>
                <div className="flex items-center gap-4">
                    <CircularProgress indeterminate size="md" color="secondary" />
                    <p className="text-sm">Processing your rent payment...</p>
                </div>
            </div>

            {/* Property Verification */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Property Verification</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <CircularProgress value={60} size="lg" color="warning" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium">3/5</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Verification in Progress</p>
                        <p className="text-xs text-gray-500">3 of 5 steps completed</p>
                    </div>
                </div>
            </div>

            {/* Maintenance Request Status */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Maintenance Request</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <CircularProgress value={100} size="lg" color="success" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium">✓</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Request Completed</p>
                        <p className="text-xs text-gray-500">Plumbing repair finished</p>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const AccessibleExample: Story = {
    render: () => (
        <div className="space-y-4">
            <div role="status" aria-label="Upload Progress">
                <CircularProgress
                    value={75}
                    size="lg"
                    aria-valuenow={75}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
            <div role="status" aria-label="Loading Content">
                <CircularProgress
                    indeterminate
                    size="lg"
                    aria-label="Loading content, please wait"
                />
            </div>
        </div>
    ),
};
