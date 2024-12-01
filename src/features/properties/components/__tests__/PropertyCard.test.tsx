import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from '../PropertyCard';

const mockProperty = {
  id: '1',
  title: 'Test Property',
  address: '123 Test St',
  price: 1500,
  type: 'apartment',
  bedrooms: 2,
  bathrooms: 1,
  area: 1000,
  status: 'available' as const,
  imageUrl: '/test.jpg'
};

describe('PropertyCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders property information correctly', () => {
    render(
      <PropertyCard 
        property={mockProperty}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.address)).toBeInTheDocument();
    expect(screen.getByText('$1,500/mo')).toBeInTheDocument();
    expect(screen.getByText('2 Beds')).toBeInTheDocument();
    expect(screen.getByText('1 Baths')).toBeInTheDocument();
    expect(screen.getByText('1000 ft²')).toBeInTheDocument();
  });

  it('displays correct status badge', () => {
    render(
      <PropertyCard 
        property={mockProperty}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const statusBadge = screen.getByText('Available');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <PropertyCard 
        property={mockProperty}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockProperty.id);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <PropertyCard 
        property={mockProperty}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockProperty.id);
  });

  it('renders optimized image with correct props', () => {
    render(
      <PropertyCard 
        property={mockProperty}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const image = screen.getByAltText(mockProperty.title);
    expect(image).toHaveAttribute('src', mockProperty.imageUrl);
    expect(image).toHaveClass('object-cover', 'w-full', 'h-full');
  });

  it('applies different status colors based on property status', () => {
    const rentedProperty = { ...mockProperty, status: 'rented' as const };
    const { rerender } = render(
      <PropertyCard 
        property={rentedProperty}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    let statusBadge = screen.getByText('Rented');
    expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-800');

    const maintenanceProperty = { ...mockProperty, status: 'maintenance' as const };
    rerender(
      <PropertyCard 
        property={maintenanceProperty}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    statusBadge = screen.getByText('Maintenance');
    expect(statusBadge).toHaveClass('bg-amber-100', 'text-amber-800');
  });
});