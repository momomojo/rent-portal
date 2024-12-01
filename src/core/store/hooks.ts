import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './types';
import { useCallback, useEffect, useRef } from 'react';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useStableCallback = <T extends (...args: any[]) => any>(callback: T) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

export const useIsFirstRender = () => {
  const isFirst = useRef(true);
  
  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }
  
  return false;
};

export const useUpdateEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
  const isFirst = useIsFirstRender();
  
  useEffect(() => {
    if (!isFirst) {
      return effect();
    }
  }, deps);
};

export function useThrottledSelector<TSelected>(
  selector: (state: RootState) => TSelected,
  wait: number = 200,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected {
  const lastRenderTime = useRef(Date.now());
  const lastValue = useRef<TSelected>();
  
  const value = useAppSelector((state) => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (timeSinceLastRender < wait) {
      return lastValue.current!;
    }
    
    const newValue = selector(state);
    if (equalityFn ? !equalityFn(newValue, lastValue.current!) : newValue !== lastValue.current) {
      lastRenderTime.current = now;
      lastValue.current = newValue;
    }
    
    return newValue;
  }, equalityFn);
  
  return value;
}