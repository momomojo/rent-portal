import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '.';
import { setLoading, setActiveModal, toggleSidebar, setTheme } from '../store/slices/uiSlice';

export const useUI = () => {
  const dispatch = useAppDispatch();
  const { isLoading, activeModal, sidebarOpen, theme } = useAppSelector((state) => state.ui);

  const showLoading = useCallback(() => {
    dispatch(setLoading(true));
  }, [dispatch]);

  const hideLoading = useCallback(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  const showModal = useCallback(
    (modalId: string) => {
      dispatch(setActiveModal(modalId));
    },
    [dispatch]
  );

  const hideModal = useCallback(() => {
    dispatch(setActiveModal(null));
  }, [dispatch]);

  const toggleSidebarOpen = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const setThemeMode = useCallback(
    (mode: 'light' | 'dark') => {
      dispatch(setTheme(mode));
    },
    [dispatch]
  );

  return {
    isLoading,
    activeModal,
    sidebarOpen,
    theme,
    showLoading,
    hideLoading,
    showModal,
    hideModal,
    toggleSidebarOpen,
    setThemeMode,
  };
};
