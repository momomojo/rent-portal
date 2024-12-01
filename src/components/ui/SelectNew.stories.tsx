import type { Meta, StoryObj } from '@storybook/react';
import { Building, DollarSign, MapPin } from 'lucide-react';
import { SelectNew } from './SelectNew';

/**
 * SelectNew component provides an enhanced select input with custom styling and accessibility features.
 * 
 * Accessibility:
 * - Uses native select element for keyboard navigation
 * - Includes proper ARIA labels and descriptions
 * - Supports screen reader announcements
 * - Maintains focus management
 * 
 * Testing:
 * - Unit tests for option selection
 * - Integration tests for form submission
 * - Accessibility tests for ARIA attributes
 * - Keyboard navigation tests
 */
const meta = {
    title: 'UI/SelectNew',
    component: SelectNew,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Enhanced select component with custom styling and accessibility features.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
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
} satisfies Meta<typeof SelectNew>;

export default meta;
type Story = StoryObj<typeof meta>;

const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
];

const locations = [
    { value: 'downtown', label: 'Downtown' },
    { value: 'suburban', label: 'Suburban' },
    { value: 'urban', label: 'Urban' },
    { value: 'rural', label: 'Rural' },
];

const priceRanges = [
    { value: '0-1000', label: '$0 - $1,000' },
    { value: '1000-2000', label: '$1,000 - $2,000' },
    { value: '2000-3000', label: '$2,000 - $3,000' },
    { value: '3000+', label: '$3,000+' },
];

export const Default: Story = {
    args: {
        options: propertyTypes,
        placeholder: 'Select property type',
    },
};

export const WithIcons: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <SelectNew
                options={propertyTypes}
                placeholder="Select property type"
                icon={<Building className="h-4 w-4" />}
            />
            <SelectNew
                options={locations}
                placeholder="Select location"
                icon={<MapPin className="h-4 w-4" />}
            />
            <SelectNew
                options={priceRanges}
                placeholder="Select price range"
                icon={<DollarSign className="h-4 w-4" />}
            />
        </div>
    ),
};

export const States: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <SelectNew
                options={propertyTypes}
                placeholder="Default select"
            />
            <SelectNew
                options={propertyTypes}
                placeholder="Disabled select"
                disabled
            />
            <SelectNew
                options={propertyTypes}
                placeholder="Required select"
                required
            />
            <SelectNew
                options={propertyTypes}
                placeholder="Error state"
                error
            />
        </div>
    ),
};

export const WithValidation: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <div>
                <SelectNew
                    options={propertyTypes}
                    placeholder="Select property type"
                    error
                    aria-invalid="true"
                    aria-describedby="property-error"
                />
                <p id="property-error" className="mt-1 text-sm text-red-500">
                    Please select a property type
                </p>
            </div>
            <div>
                <SelectNew
                    options={locations}
                    placeholder="Select location"
                    error
                    aria-invalid="true"
                    aria-describedby="location-error"
                />
                <p id="location-error" className="mt-1 text-sm text-red-500">
                    Location is required
                </p>
            </div>
        </div>
    ),
};

export const RealWorldExamples: Story = {
    render: () => (
        <div className="space-y-8">
            {/* Property Search Form */}
            <form className="w-[300px] space-y-4">
                <div className="space-y-2">
                    <label htmlFor="propertyType" className="text-sm font-medium">
                        Property Type
                    </label>
                    <SelectNew
                        id="propertyType"
                        options={propertyTypes}
                        placeholder="Select property type"
                        icon={<Building className="h-4 w-4" />}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                        Location
                    </label>
                    <SelectNew
                        id="location"
                        options={locations}
                        placeholder="Select location"
                        icon={<MapPin className="h-4 w-4" />}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="priceRange" className="text-sm font-medium">
                        Price Range
                    </label>
                    <SelectNew
                        id="priceRange"
                        options={priceRanges}
                        placeholder="Select price range"
                        icon={<DollarSign className="h-4 w-4" />}
                        required
                    />
                </div>
            </form>

            {/* Property Filter */}
            <div className="w-[300px] rounded-lg border p-4">
                <h3 className="mb-4 text-sm font-medium">Filter Properties</h3>
                <div className="space-y-3">
                    <SelectNew
                        options={propertyTypes}
                        placeholder="All property types"
                        icon={<Building className="h-4 w-4" />}
                    />
                    <SelectNew
                        options={locations}
                        placeholder="All locations"
                        icon={<MapPin className="h-4 w-4" />}
                    />
                    <SelectNew
                        options={priceRanges}
                        placeholder="Any price"
                        icon={<DollarSign className="h-4 w-4" />}
                    />
                </div>
            </div>
        </div>
    ),
};

export const AccessibleExample: Story = {
    render: () => (
        <div className="w-[300px] space-y-4">
            <div role="group" aria-labelledby="property-label">
                <span id="property-label" className="mb-2 block text-sm font-medium">
                    Property Type
                </span>
                <SelectNew
                    options={propertyTypes}
                    placeholder="Select property type"
                    aria-required="true"
                    aria-describedby="property-hint"
                />
                <span id="property-hint" className="mt-1 block text-xs text-gray-500">
                    Choose the type of property you're interested in
                </span>
            </div>

            <div role="group" aria-labelledby="location-label">
                <span id="location-label" className="mb-2 block text-sm font-medium">
                    Location
                </span>
                <SelectNew
                    options={locations}
                    placeholder="Select location"
                    aria-required="true"
                    aria-describedby="location-hint"
                />
                <span id="location-hint" className="mt-1 block text-xs text-gray-500">
                    Select your preferred location
                </span>
            </div>
        </div>
    ),
};
