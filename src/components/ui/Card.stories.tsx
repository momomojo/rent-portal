import type { Meta, StoryObj } from '@storybook/react';
import { Calendar, Clock, DollarSign, Home, Mail, MapPin, Phone, User } from 'lucide-react';
import React from 'react';
import { Card } from './Card';

/**
 * Card component provides a flexible container for content with consistent styling.
 * 
 * Accessibility:
 * - Uses semantic HTML structure
 * - Supports keyboard navigation for interactive elements
 * - Maintains proper heading hierarchy
 * - Includes proper ARIA labels
 * 
 * Testing:
 * - Unit tests for rendering content
 * - Integration tests for interactive features
 * - Accessibility tests for keyboard navigation
 * - Visual regression tests for layout
 */
const meta = {
    title: 'UI/Card',
    component: Card,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Card container for displaying grouped content with consistent styling.',
            },
        },
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <div className="p-4">
                <h3 className="text-lg font-semibold">Card Title</h3>
                <p className="mt-2 text-gray-600">Card content goes here.</p>
            </div>
        ),
    },
};

export const PropertyCard: Story = {
    render: () => (
        <Card className="w-[350px]">
            <div className="relative">
                <img
                    src="https://placehold.co/350x200"
                    alt="Property"
                    className="h-[200px] w-full object-cover"
                />
                <span className="absolute right-2 top-2 rounded bg-green-500 px-2 py-1 text-xs font-medium text-white">
                    Available
                </span>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">Modern Downtown Apartment</h3>
                <div className="mt-2 flex items-center text-gray-600">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span className="text-sm">123 Main St, Downtown</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-green-600">
                        <DollarSign className="mr-1 h-4 w-4" />
                        <span className="text-lg font-semibold">1,500</span>
                        <span className="text-sm text-gray-600">/month</span>
                    </div>
                    <button className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                        View Details
                    </button>
                </div>
            </div>
        </Card>
    ),
};

export const PaymentCard: Story = {
    render: () => (
        <Card className="w-[350px]">
            <div className="border-b p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">June 2024 Rent</h3>
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                        Due in 5 days
                    </span>
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Due Date: June 1, 2024</span>
                    </div>
                    <div className="flex items-center text-gray-900">
                        <DollarSign className="mr-1 h-4 w-4" />
                        <span className="text-lg font-semibold">1,500.00</span>
                    </div>
                </div>
                <div className="mt-4">
                    <button className="w-full rounded bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600">
                        Pay Now
                    </button>
                </div>
            </div>
        </Card>
    ),
};

export const MaintenanceRequestCard: Story = {
    render: () => (
        <Card className="w-[350px]">
            <div className="border-b p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Maintenance Request #1234</h3>
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600">
                        In Progress
                    </span>
                </div>
            </div>
            <div className="p-4">
                <p className="text-gray-600">Leaking faucet in master bathroom</p>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Submitted: May 15, 2024</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Scheduled: May 20, 2024</span>
                    </div>
                </div>
                <div className="mt-4 flex space-x-2">
                    <button className="flex-1 rounded border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button className="flex-1 rounded bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600">
                        View Details
                    </button>
                </div>
            </div>
        </Card>
    ),
};

export const TenantProfileCard: Story = {
    render: () => (
        <Card className="w-[350px]">
            <div className="flex items-center border-b p-4">
                <div className="h-12 w-12 rounded-full bg-gray-200">
                    <User className="h-full w-full p-2 text-gray-600" />
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-semibold">John Smith</h3>
                    <span className="text-sm text-gray-600">Tenant since Jan 2024</span>
                </div>
            </div>
            <div className="p-4">
                <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Unit 301, Building A</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Phone className="mr-2 h-4 w-4" />
                        <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>john.smith@example.com</span>
                    </div>
                </div>
                <div className="mt-4 flex space-x-2">
                    <button className="flex-1 rounded border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50">
                        Message
                    </button>
                    <button className="flex-1 rounded bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600">
                        View Profile
                    </button>
                </div>
            </div>
        </Card>
    ),
};

export const AccessibleExample: Story = {
    render: () => (
        <Card className="w-[350px]">
            <div
                role="region"
                aria-labelledby="card-title"
                className="p-4"
            >
                <h3 id="card-title" className="text-lg font-semibold">
                    Accessible Card Example
                </h3>
                <div className="mt-4 space-y-2">
                    <button
                        className="w-full rounded bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        aria-label="View more details about this property"
                    >
                        View Details
                    </button>
                    <button
                        className="w-full rounded border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50"
                        aria-label="Contact support for assistance"
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </Card>
    ),
};
