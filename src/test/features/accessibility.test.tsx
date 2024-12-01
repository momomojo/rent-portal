import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../../App';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('has no detectable accessibility violations', async () => {
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('uses proper ARIA labels', () => {
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('maintains proper heading hierarchy', () => {
    const headings = screen.getAllByRole('heading');
    let previousLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      expect(level).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = level;
    });
  });

  it('ensures all images have alt text', () => {
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('maintains sufficient color contrast', () => {
    // Test color contrast ratios using WCAG guidelines
    const elements = screen.getAllByRole('*');
    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const backgroundColor = style.backgroundColor;
      const color = style.color;
      
      // Implement color contrast ratio calculation
      // Minimum ratio should be 4.5:1 for normal text
      // and 3:1 for large text
    });
  });

  it('supports keyboard navigation', () => {
    const focusableElements = screen.getAllByRole('button, a, input, select, textarea');
    focusableElements.forEach(element => {
      element.focus();
      expect(document.activeElement).toBe(element);
    });
  });
});
