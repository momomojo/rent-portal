import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { LinearProgress } from './LinearProgress';

/**
 * LinearProgress component provides horizontal progress indicators.
 * 
 * Accessibility:
 * - Uses role="progressbar"
 * - Includes aria-valuenow, aria-valuemin, and aria-valuemax
 * - Provides aria-label for screen readers
 * - Supports reduced motion preferences
 * 
 * Testing:
 * - Unit tests for progress calculations
 * - Visual regression tests for animations
 * - Accessibility tests for ARIA attributes
 * - Performance tests for smooth animations
 */
const meta = {
    title: 'UI/LinearProgress',
    component: LinearProgress,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Linear progress indicator for showing progress and loading states.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: { type: 'range', min: 0, max: 100 },
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'error', 'warning'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        indeterminate: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof LinearProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: 60,
    },
};

export const Sizes: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <LinearProgress size="sm" value={60} />
            <LinearProgress size="md" value={60} />
            <LinearProgress size="lg" value={60} />
        </div>
    ),
};

export const Colors: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <LinearProgress color="primary" value={60} />
            <LinearProgress color="secondary" value={60} />
            <LinearProgress color="success" value={60} />
            <LinearProgress color="error" value={60} />
            <LinearProgress color="warning" value={60} />
        </div>
    ),
};

export const States: Story = {
    render: () => (
        <div className="w-[300px] space-y-8">
            {/* Determinate Progress */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Determinate Progress</h3>
                <div className="space-y-4">
                    <LinearProgress value={25} />
                    <LinearProgress value={50} />
                    <LinearProgress value={75} />
                    <LinearProgress value={100} />
                </div>
            </div>

            {/* Indeterminate Progress */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Indeterminate Progress</h3>
                <div className="space-y-4">
                    <LinearProgress indeterminate />
                    <LinearProgress indeterminate color="secondary" />
                    <LinearProgress indeterminate color="success" />
                </div>
            </div>
        </div>
    ),
};

export const WithLabel: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="text-sm">Uploading...</span>
                    <span className="text-sm">75%</span>
                </div>
                <LinearProgress value={75} />
            </div>
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="text-sm text-error">Failed</span>
                    <span className="text-sm text-error">25%</span>
                </div>
                <LinearProgress value={25} color="error" />
            </div>
        </div>
    ),
};

export const RealWorldExamples: Story = {
    render: () => (
        <div className="w-[300px] space-y-8">
            {/* File Upload Progress */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Document Upload</h3>
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="text-sm">lease_agreement.pdf</span>
                        <span className="text-sm">85%</span>
                    </div>
                    <LinearProgress value={85} color="primary" />
                    <span className="text-xs text-gray-500">8.5 MB / 10 MB</span>
                </div>
            </div>

            {/* Multi-step Form Progress */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Rental Application</h3>
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="text-sm">Step 3 of 5</span>
                        <span className="text-sm">60%</span>
                    </div>
                    <LinearProgress value={60} color="secondary" />
                    <span className="text-xs text-gray-500">Employment Information</span>
                </div>
            </div>

            {/* Payment Processing */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Payment Processing</h3>
                <div className="space-y-1">
                    <span className="text-sm">Verifying payment details...</span>
                    <LinearProgress indeterminate color="success" />
                </div>
            </div>

            {/* Maintenance Progress */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Maintenance Request #1234</h3>
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="text-sm">In Progress</span>
                        <span className="text-sm">40%</span>
                    </div>
                    <LinearProgress value={40} color="warning" />
                    <span className="text-xs text-gray-500">Parts ordered, awaiting delivery</span>
                </div>
            </div>
        </div>
    ),
};

export const AccessibleExample: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <div
                role="progressbar"
                aria-label="Upload Progress"
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
                className="space-y-1"
            >
                <div className="flex justify-between">
                    <span className="text-sm" id="progress-label">Upload Progress</span>
                    <span className="text-sm" aria-labelledby="progress-label">75%</span>
                </div>
                <LinearProgress value={75} />
            </div>

            <div
                role="progressbar"
                aria-label="Loading Content"
                className="space-y-1"
            >
                <span className="text-sm">Loading, please wait...</span>
                <LinearProgress indeterminate />
            </div>
        </div>
    ),
};
