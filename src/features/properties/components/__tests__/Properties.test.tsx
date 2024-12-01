import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Properties } from '../Properties';
import { useQuery } from '@tanstack/react-query';
import { fetchProperties } from '../../api/properties';

// Mock dependencies
jest.mock('@tanstack/react-query');
jest.mock('../../api/properties');

const mockProperties = [
  {
    id: '1',
    title: 'Test Property 1',
    address: '123 Test St',
    price: 1500,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
    status: 'available',
    imageUrl: '/test.jpg'
  },
  // Add more mock properties as needed
];

describe('Properties', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockProperties,
      isLoading: false,
      error: null
    });
  });

  it('renders properties list', () => {
    render(<Properties />);
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Test Property 1')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true
    });
    render(<Properties />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      error: new Error('Failed to load')
    });
    render(<Properties />);
    expect(screen.getByText('Error loading properties')).toBeInTheDocument();
  });

  it('toggles filters visibility', () => {
    render(<Properties />);
    const filtersButton = screen.getByText('Filters');
    fireEvent.click(filtersButton);
    expect(screen.getByText('Property Type')).toBeInTheDocument();
  });

  it('applies filters correctly', async () => {
    render(<Properties />);
    
    // Open filters
    fireEvent.click(screen.getByText('Filters'));
    
    // Select property type
    const typeSelect = screen.getByPlaceholderText('Property Type');
    fireEvent.change(typeSelect, { target: { value: 'apartment' } });
    
    await waitFor(() => {
      expect(fetchProperties).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'apartment' })
      );
    });
  });

  it('shows no results message when no properties found', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
    
    render(<Properties />);
    expect(screen.getByText('No properties found')).toBeInTheDocument();
  });
});