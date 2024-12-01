import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingFallback, Skeleton, PageLoadingFallback } from '../LoadingFallback';

describe('LoadingFallback', () => {
  it('renders loading spinner and text', () => {
    render(<LoadingFallback />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies fullScreen class when prop is true', () => {
    const { container } = render(<LoadingFallback fullScreen />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });

  it('applies custom className when provided', () => {
    const { container } = render(<LoadingFallback className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-4 w-full" />);
    expect(container.firstChild).toHaveClass('h-4', 'w-full');
  });
});

describe('PageLoadingFallback', () => {
  it('renders skeleton placeholders', () => {
    const { container } = render(<PageLoadingFallback />);
    const skeletons = container.getElementsByClassName('animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});