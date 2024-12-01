import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionTimeoutWarning } from '../components/SessionTimeoutWarning';

describe('SessionTimeoutWarning', () => {
  const defaultProps = {
    open: true,
    onExtend: jest.fn(),
    onClose: jest.fn(),
    remainingTime: 300 // 5 minutes in seconds
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the warning message with correct remaining time', () => {
    render(<SessionTimeoutWarning {...defaultProps} />);
    
    expect(screen.getByText(/your session will expire in 5:00/i)).toBeInTheDocument();
  });

  it('should call onExtend when extend button is clicked', () => {
    render(<SessionTimeoutWarning {...defaultProps} />);
    
    const extendButton = screen.getByText(/extend session/i);
    fireEvent.click(extendButton);
    
    expect(defaultProps.onExtend).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button is clicked', () => {
    render(<SessionTimeoutWarning {...defaultProps} />);
    
    // Material-UI Alert close button has a title "Close"
    const closeButton = screen.getByTitle(/close/i);
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not be visible when open is false', () => {
    render(<SessionTimeoutWarning {...defaultProps} open={false} />);
    
    expect(screen.queryByText(/your session will expire/i)).not.toBeInTheDocument();
  });

  it('should format remaining time correctly', () => {
    const testCases = [
      { time: 60, expected: '1:00' },
      { time: 30, expected: '0:30' },
      { time: 125, expected: '2:05' },
      { time: 3599, expected: '59:59' }
    ];

    testCases.forEach(({ time, expected }) => {
      const { rerender } = render(
        <SessionTimeoutWarning {...defaultProps} remainingTime={time} />
      );

      expect(screen.getByText(new RegExp(`your session will expire in ${expected}`, 'i')))
        .toBeInTheDocument();

      rerender(<></>);
    });
  });

  it('should handle zero remaining time', () => {
    render(<SessionTimeoutWarning {...defaultProps} remainingTime={0} />);
    
    expect(screen.getByText(/your session will expire in 0:00/i)).toBeInTheDocument();
  });
});
