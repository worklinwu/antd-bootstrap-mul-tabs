import { useState, useCallback } from 'react';
import { useUpdateEffect } from 'ahooks';
import storage from '@/utils/storage';

interface IFuncUpdater<T> {
  (previousState?: T): T;
}
type StorageStateResult<T> = [T | undefined, (value?: T | IFuncUpdater<T>) => void];

function isFunction<T>(obj: any): obj is T {
  return typeof obj === 'function';
}

function getStoredValue<T>(key: string, defaultValue: any): any {
  const raw = storage.get(key);
  if (raw) {
    return raw;
  }
  if (isFunction<IFuncUpdater<T>>(defaultValue)) {
    return defaultValue();
  }
  return defaultValue;
}

/**
 * 与 utils/storage 相配套的 hooks
 * @param key
 * @param defaultValue
 */
function useStorageState<T>(key: string, defaultValue?: T | IFuncUpdater<T>): StorageStateResult<T> {
  const [state, setState] = useState<T | undefined>(() => getStoredValue<T>(key, defaultValue));
  useUpdateEffect(() => {
    setState(getStoredValue<T>(key, defaultValue));
  }, [key]);

  const updateState = useCallback(
    (value?: T | IFuncUpdater<T>) => {
      if (typeof value === 'undefined') {
        storage.remove(key);
        setState(undefined);
      } else if (isFunction<IFuncUpdater<T>>(value)) {
        const previousState = getStoredValue<T>(key, defaultValue);
        const currentState = value(previousState);
        storage.set(key, currentState);
        setState(currentState);
      } else {
        storage.set(key, value);
        setState(value);
      }
    },
    [defaultValue, key],
  );

  return [state, updateState];
}

export default useStorageState;
