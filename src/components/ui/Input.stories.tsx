import type { Meta, StoryObj } from '@storybook/react';
import { Calendar, DollarSign, Lock, Mail, Phone, Search } from 'lucide-react';
import React from 'react';
import { Input } from './Input';

/**
 * Input component provides a standard text input with various styles and states.
 * 
 * Accessibility:
 * - Uses semantic HTML input element
 * - Supports aria-label and aria-describedby
 * - Maintains focus states for keyboard navigation
 * - Provides error states with aria-invalid
 * 
 * Testing:
 * - Unit tests for value changes
 * - Integration tests for form submission
 * - Accessibility tests for ARIA attributes
 * - Visual regression tests for states
 */
const meta = {
    title: 'UI/Input',
    component: Input,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Input component for collecting user data with support for various states and styles.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
        },
        disabled: {
            control: 'boolean',
        },
        required: {
            control: 'boolean',
        },
        error: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
    },
};

export const InputTypes: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <Input type="text" placeholder="Text input" />
            <Input type="email" placeholder="Email input" />
            <Input type="password" placeholder="Password input" />
            <Input type="number" placeholder="Number input" />
            <Input type="tel" placeholder="Phone input" />
            <Input type="search" placeholder="Search input" />
        </div>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input className="pl-10" type="search" placeholder="Search..." />
            </div>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input className="pl-10" type="email" placeholder="Email address" />
            </div>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input className="pl-10" type="password" placeholder="Password" />
            </div>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input className="pl-10" type="tel" placeholder="Phone number" />
            </div>
        </div>
    ),
};

export const States: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <Input placeholder="Default input" />
            <Input placeholder="Disabled input" disabled />
            <Input placeholder="Required input" required />
            <Input placeholder="Error input" error />
            <Input placeholder="Read-only input" readOnly value="Read-only value" />
        </div>
    ),
};

export const Validation: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <div>
                <Input
                    type="email"
                    placeholder="Email address"
                    error
                    aria-invalid="true"
                    aria-describedby="email-error"
                />
                <p id="email-error" className="mt-1 text-sm text-red-500">
                    Please enter a valid email address
                </p>
            </div>
            <div>
                <Input
                    type="password"
                    placeholder="Password"
                    error
                    aria-invalid="true"
                    aria-describedby="password-error"
                />
                <p id="password-error" className="mt-1 text-sm text-red-500">
                    Password must be at least 8 characters
                </p>
            </div>
        </div>
    ),
};

export const RealWorldExamples: Story = {
    render: () => (
        <div className="space-y-8">
            {/* Login Form */}
            <form className="w-[300px] space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            placeholder="Enter your email"
                            required
                            aria-required="true"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            id="password"
                            type="password"
                            className="pl-10"
                            placeholder="Enter your password"
                            required
                            aria-required="true"
                        />
                    </div>
                </div>
            </form>

            {/* Payment Form */}
            <form className="w-[300px] space-y-4">
                <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                        Payment Amount
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            id="amount"
                            type="number"
                            className="pl-10"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                            aria-required="true"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium">
                        Payment Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            id="date"
                            type="date"
                            className="pl-10"
                            required
                            aria-required="true"
                        />
                    </div>
                </div>
            </form>

            {/* Search Form */}
            <form className="w-[300px]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        type="search"
                        className="pl-10"
                        placeholder="Search properties..."
                        aria-label="Search properties"
                    />
                </div>
            </form>
        </div>
    ),
};
