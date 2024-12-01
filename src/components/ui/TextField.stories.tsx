import type { Meta, StoryObj } from '@storybook/react';
import { Calendar, DollarSign, Lock, Mail, MapPin, Phone, Search, User } from 'lucide-react';
import React from 'react';
import { TextField } from './TextField';

/**
 * TextField component provides enhanced input functionality with labels and validation.
 * 
 * Accessibility:
 * - Uses semantic HTML with proper label associations
 * - Includes aria-invalid for error states
 * - Provides aria-describedby for helper text
 * - Supports keyboard navigation
 * 
 * Testing:
 * - Unit tests for value changes and validation
 * - Integration tests for form submission
 * - Accessibility tests for ARIA attributes
 * - Visual regression tests for states
 */
const meta = {
    title: 'UI/TextField',
    component: TextField,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Enhanced text input with built-in label and validation support.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'tel', 'search', 'url'],
        },
        label: {
            control: 'text',
        },
        error: {
            control: 'text',
        },
        helperText: {
            control: 'text',
        },
        required: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'Label',
        placeholder: 'Enter text...',
    },
};

export const Variants: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <TextField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                icon={<Mail className="h-4 w-4" />}
            />
            <TextField
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={<Lock className="h-4 w-4" />}
            />
            <TextField
                label="Amount"
                type="number"
                placeholder="0.00"
                icon={<DollarSign className="h-4 w-4" />}
                startAdornment="$"
            />
            <TextField
                label="Search Properties"
                type="search"
                placeholder="Search..."
                icon={<Search className="h-4 w-4" />}
            />
        </div>
    ),
};

export const States: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <TextField
                label="Default"
                placeholder="Default state"
            />
            <TextField
                label="Required"
                placeholder="Required field"
                required
            />
            <TextField
                label="Disabled"
                placeholder="Disabled state"
                disabled
            />
            <TextField
                label="With Helper"
                placeholder="With helper text"
                helperText="This is a helper text"
            />
            <TextField
                label="With Error"
                placeholder="Error state"
                error="This field is required"
                value=""
            />
            <TextField
                label="Success"
                placeholder="Success state"
                value="Valid input"
                success
            />
        </div>
    ),
};

export const WithValidation: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <TextField
                label="Email"
                type="email"
                placeholder="Enter email"
                error="Please enter a valid email address"
                icon={<Mail className="h-4 w-4" />}
                value="invalid-email"
            />
            <TextField
                label="Password"
                type="password"
                placeholder="Enter password"
                helperText="Must be at least 8 characters"
                icon={<Lock className="h-4 w-4" />}
            />
            <TextField
                label="Phone"
                type="tel"
                placeholder="Enter phone number"
                error="Invalid phone number format"
                icon={<Phone className="h-4 w-4" />}
                value="123"
            />
        </div>
    ),
};

export const RealWorldExamples: Story = {
    render: () => (
        <div className="space-y-8">
            {/* Login Form */}
            <form className="w-[300px] space-y-4">
                <h3 className="text-lg font-semibold">Login</h3>
                <TextField
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    icon={<Mail className="h-4 w-4" />}
                />
                <TextField
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    icon={<Lock className="h-4 w-4" />}
                />
            </form>

            {/* Property Search */}
            <form className="w-[300px] space-y-4">
                <h3 className="text-lg font-semibold">Property Search</h3>
                <TextField
                    label="Location"
                    placeholder="Enter location"
                    icon={<MapPin className="h-4 w-4" />}
                />
                <div className="flex space-x-2">
                    <TextField
                        label="Min Price"
                        type="number"
                        placeholder="0"
                        startAdornment="$"
                    />
                    <TextField
                        label="Max Price"
                        type="number"
                        placeholder="0"
                        startAdornment="$"
                    />
                </div>
            </form>

            {/* Profile Form */}
            <form className="w-[300px] space-y-4">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <TextField
                    label="Full Name"
                    placeholder="Enter your name"
                    required
                    icon={<User className="h-4 w-4" />}
                />
                <TextField
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    required
                    icon={<Phone className="h-4 w-4" />}
                />
                <TextField
                    label="Move-in Date"
                    type="date"
                    required
                    icon={<Calendar className="h-4 w-4" />}
                />
            </form>
        </div>
    ),
};

export const AccessibleExample: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <div role="form" aria-label="Contact Information">
                <TextField
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    required
                    aria-required="true"
                    aria-invalid={false}
                    icon={<Mail className="h-4 w-4" />}
                />
            </div>

            <div role="form" aria-label="Password Input">
                <TextField
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    aria-required="true"
                    aria-invalid={true}
                    error="Password must be at least 8 characters"
                    icon={<Lock className="h-4 w-4" />}
                    aria-describedby="password-error"
                />
                <div id="password-error" className="mt-1 text-sm text-red-500">
                    Password must be at least 8 characters
                </div>
            </div>
        </div>
    ),
};
