import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStateChange } from '../useAuthStateChange';
import { auth } from '../../../../core/firebase/config';
import * as Sentry from '@sentry/react';

// Mock Firebase auth
jest.mock('../../../../core/firebase/config', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    currentUser: null
  }
}));

// Mock Sentry
jest.mock('@sentry/react', () => ({
  withScope: jest.fn((cb) => cb({ setTag: jest.fn(), setContext: jest.fn() })),
  captureException: jest.fn()
}));

// Mock logger
jest.mock('../../../../core/utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

describe('useAuthStateChange', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful auth state changes', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (auth.onAuthStateChanged as jest.Mock).mockImplementation((onNext) => {
      onNext(mockUser);
      return () => {};
    });

    const { result } = renderHook(() => useAuthStateChange());

    expect(result.current.currentUser).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('should handle auth errors', () => {
    const mockError = new Error('Auth error');
    (mockError as any).code = 'auth/network-request-failed';

    (auth.onAuthStateChanged as jest.Mock).mockImplementation((onNext, onError) => {
      onError(mockError);
      return () => {};
    });

    const { result } = renderHook(() => useAuthStateChange());

    expect(result.current.error).toEqual({
      code: 'auth/network-request-failed',
      message: 'Network connection failed. Please check your internet connection.',
      retry: expect.any(Function)
    });
    expect(Sentry.withScope).toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
  });

  it('should handle retry attempts with exponential backoff', async () => {
    jest.useFakeTimers();
    const mockError = new Error('Auth error');
    (mockError as any).code = 'auth/network-request-failed';

    (auth.onAuthStateChanged as jest.Mock).mockImplementation((onNext, onError) => {
      onError(mockError);
      return () => {};
    });

    const { result } = renderHook(() => useAuthStateChange());

    // First retry
    await act(async () => {
      result.current.retryWithBackoff();
      jest.advanceTimersByTime(1000); // Base delay
    });

    // Second retry
    await act(async () => {
      result.current.retryWithBackoff();
      jest.advanceTimersByTime(2000); // 2x base delay
    });

    // Third retry
    await act(async () => {
      result.current.retryWithBackoff();
      jest.advanceTimersByTime(4000); // 4x base delay
    });

    expect(result.current.error?.retry).toBeUndefined(); // No more retries after max attempts
    jest.useRealTimers();
  });

  it('should cleanup auth listener on unmount', () => {
    const unsubscribe = jest.fn();
    (auth.onAuthStateChanged as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useAuthStateChange());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('should reset error state when auth state changes successfully', () => {
    const mockError = new Error('Auth error');
    (mockError as any).code = 'auth/network-request-failed';
    const mockUser = { uid: '123', email: 'test@example.com' };

    let triggerAuthChange: (user: any) => void;
    (auth.onAuthStateChanged as jest.Mock).mockImplementation((onNext) => {
      triggerAuthChange = onNext;
      return () => {};
    });

    const { result } = renderHook(() => useAuthStateChange());

    // Simulate error
    act(() => {
      result.current.error = {
        code: 'auth/network-request-failed',
        message: 'Network error',
        retry: jest.fn()
      };
    });

    // Simulate successful auth state change
    act(() => {
      triggerAuthChange(mockUser);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.currentUser).toEqual(mockUser);
  });
});
