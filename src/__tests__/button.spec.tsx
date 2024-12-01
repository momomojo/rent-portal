import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../components/Button/Button';

test('Button renders children correctly', () => {
  render(<Button>Test Button</Button>);
  expect(screen.getByText('Test Button')).toBeInTheDocument();
});
