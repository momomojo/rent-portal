import { renderHook, act } from '@testing-library/react-hooks';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { useAuthState } from '@shared/hooks/useAuthState';
import { signOut } from 'firebase/auth';

// Mock dependencies
jest.mock('@shared/hooks/useAuthState');
jest.mock('firebase/auth');
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));

describe('useSessionTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (useAuthState as jest.Mock).mockReturnValue({ user: { uid: '123' } });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not set timeout when user is not authenticated', () => {
    (useAuthState as jest.Mock).mockReturnValue({ user: null });
    
    renderHook(() => useSessionTimeout(30));
    
    act(() => {
      jest.advanceTimersByTime(30 * 60 * 1000); // 30 minutes
    });
    
    expect(signOut).not.toHaveBeenCalled();
  });

  it('should show warning before session timeout', () => {
    const { result } = renderHook(() => useSessionTimeout(30));
    
    // Advance time to just before warning (25 minutes)
    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });
    expect(result.current.showWarning).toBe(false);
    
    // Advance to warning time (25-30 minutes)
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });
    expect(result.current.showWarning).toBe(true);
  });

  it('should sign out user after timeout period', () => {
    renderHook(() => useSessionTimeout(30));
    
    act(() => {
      jest.advanceTimersByTime(30 * 60 * 1000); // 30 minutes
    });
    
    expect(signOut).toHaveBeenCalled();
  });

  it('should reset timeout on user activity', () => {
    const { result } = renderHook(() => useSessionTimeout(30));
    
    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000); // 15 minutes
    });
    
    // Simulate user activity
    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
    });
    
    // Advance time to original timeout
    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000); // Another 15 minutes
    });
    
    // Should not have signed out yet because timer was reset
    expect(signOut).not.toHaveBeenCalled();
    
    // Advance to new timeout
    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000); // Final 15 minutes
    });
    
    // Now should have signed out
    expect(signOut).toHaveBeenCalled();
  });

  it('should allow extending session from warning state', () => {
    const { result } = renderHook(() => useSessionTimeout(30));
    
    // Advance to warning state
    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000);
    });
    
    expect(result.current.showWarning).toBe(true);
    
    // Extend session
    act(() => {
      result.current.extendSession();
    });
    
    expect(result.current.showWarning).toBe(false);
    
    // Advance time to original timeout
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });
    
    // Should not have signed out yet because session was extended
    expect(signOut).not.toHaveBeenCalled();
  });

  it('should cleanup timeouts on unmount', () => {
    const { unmount } = renderHook(() => useSessionTimeout(30));
    
    unmount();
    
    // Advance time past timeout
    act(() => {
      jest.advanceTimersByTime(31 * 60 * 1000);
    });
    
    expect(signOut).not.toHaveBeenCalled();
  });
});
