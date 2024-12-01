import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '../useAuthState';
import { auth } from '../../lib/firebase';

vi.mock('../../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
  },
}));

describe('useAuthState', () => {
  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuthState());
    expect(result.current.loading).toBe(true);
  });

  it('updates state when user logs in', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
    };

    vi.mocked(auth.onAuthStateChanged).mockImplementation((callback) => {
      callback(mockUser);
      return () => {};
    });

    const { result } = renderHook(() => useAuthState());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('handles null user state', async () => {
    vi.mocked(auth.onAuthStateChanged).mockImplementation((callback) => {
      callback(null);
      return () => {};
    });

    const { result } = renderHook(() => useAuthState());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});