import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Typography } from './Typography';

/**
 * Typography component provides consistent text styling across the application.
 * 
 * Accessibility:
 * - Uses semantic HTML elements (h1-h6, p, span)
 * - Maintains proper heading hierarchy
 * - Ensures sufficient color contrast
 * - Supports responsive font sizes
 * 
 * Testing:
 * - Unit tests for rendering correct HTML elements
 * - Visual regression tests for font styles
 * - Accessibility tests for heading hierarchy
 * - Responsive tests for font scaling
 */
const meta = {
    title: 'UI/Typography',
    component: Typography,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Typography system for consistent text styling across the rent portal.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption', 'label'],
        },
        weight: {
            control: 'select',
            options: ['normal', 'medium', 'semibold', 'bold'],
        },
        color: {
            control: 'select',
            options: ['default', 'primary', 'secondary', 'muted', 'error'],
        },
    },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Typography Example',
        variant: 'body',
    },
};

export const Headings: Story = {
    render: () => (
        <div className="space-y-4">
            <Typography variant="h1">Heading 1 - Property Listings</Typography>
            <Typography variant="h2">Heading 2 - Featured Properties</Typography>
            <Typography variant="h3">Heading 3 - Property Details</Typography>
            <Typography variant="h4">Heading 4 - Amenities</Typography>
            <Typography variant="h5">Heading 5 - Contact Information</Typography>
            <Typography variant="h6">Heading 6 - Additional Notes</Typography>
        </div>
    ),
};

export const TextStyles: Story = {
    render: () => (
        <div className="space-y-4">
            <Typography variant="body">
                Body text - This is the standard body text used throughout the application.
                It provides good readability for longer content sections.
            </Typography>
            <Typography variant="caption">
                Caption text - Used for supplementary information and smaller text elements.
            </Typography>
            <Typography variant="label">
                Label text - Commonly used for form labels and small headers.
            </Typography>
        </div>
    ),
};

export const Weights: Story = {
    render: () => (
        <div className="space-y-4">
            <Typography variant="body" weight="normal">
                Normal weight - Default text weight
            </Typography>
            <Typography variant="body" weight="medium">
                Medium weight - Slightly emphasized text
            </Typography>
            <Typography variant="body" weight="semibold">
                Semibold weight - Important information
            </Typography>
            <Typography variant="body" weight="bold">
                Bold weight - Strong emphasis
            </Typography>
        </div>
    ),
};

export const Colors: Story = {
    render: () => (
        <div className="space-y-4">
            <Typography variant="body" color="default">
                Default color - Standard text color
            </Typography>
            <Typography variant="body" color="primary">
                Primary color - Used for primary content
            </Typography>
            <Typography variant="body" color="secondary">
                Secondary color - Used for secondary content
            </Typography>
            <Typography variant="body" color="muted">
                Muted color - Used for less important text
            </Typography>
            <Typography variant="body" color="error">
                Error color - Used for error messages
            </Typography>
        </div>
    ),
};

export const RealWorldExamples: Story = {
    render: () => (
        <div className="space-y-8">
            {/* Property Listing Example */}
            <div className="space-y-2">
                <Typography variant="h2">Luxury Downtown Apartment</Typography>
                <Typography variant="body" color="secondary">
                    123 Main Street, Downtown Area
                </Typography>
                <Typography variant="h4">$2,500/month</Typography>
                <Typography variant="body">
                    Modern 2-bedroom apartment featuring high-end finishes, open concept
                    living, and stunning city views.
                </Typography>
                <Typography variant="caption" color="muted">
                    Available from July 1st, 2024
                </Typography>
            </div>

            {/* Payment Information Example */}
            <div className="space-y-2">
                <Typography variant="h3">Payment Summary</Typography>
                <Typography variant="body" weight="semibold">
                    Monthly Rent: $2,500
                </Typography>
                <Typography variant="body" color="secondary">
                    Due Date: 1st of every month
                </Typography>
                <Typography variant="caption" color="error">
                    Late fees apply after the 5th
                </Typography>
            </div>

            {/* Maintenance Request Example */}
            <div className="space-y-2">
                <Typography variant="h4">Maintenance Request #1234</Typography>
                <Typography variant="body" weight="medium">
                    Status: In Progress
                </Typography>
                <Typography variant="body">
                    Plumbing issue in master bathroom - Leaking faucet
                </Typography>
                <Typography variant="caption" color="muted">
                    Submitted on: June 15, 2024
                </Typography>
            </div>

            {/* Form Labels Example */}
            <div className="space-y-2">
                <Typography variant="label" weight="medium">
                    Contact Information
                </Typography>
                <Typography variant="caption">
                    Please provide your current contact details
                </Typography>
                <div className="space-y-1">
                    <Typography variant="label">Email Address</Typography>
                    <Typography variant="caption" color="muted">
                        We'll never share your email with anyone else
                    </Typography>
                </div>
            </div>
        </div>
    ),
};

export const ResponsiveText: Story = {
    render: () => (
        <div className="space-y-4">
            <Typography variant="h1" className="text-2xl md:text-3xl lg:text-4xl">
                Responsive Heading
            </Typography>
            <Typography variant="body" className="text-sm md:text-base lg:text-lg">
                This text adjusts its size based on the screen width, ensuring optimal
                readability across different devices.
            </Typography>
        </div>
    ),
};
