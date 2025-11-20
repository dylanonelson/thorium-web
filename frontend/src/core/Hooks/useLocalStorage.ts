"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const useLocalStorage = (key: string) => {
  const [localData, setLocalData] = useState<any>(null);
  const cachedLocalData = useRef<any>(null);

  const setValue = useCallback(
    (newValue: any, silent = false) => {
      if (!silent) {
        setLocalData(newValue);
      }
      cachedLocalData.current = newValue;
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key],
  );

  const getValue = useCallback(() => {
    if (cachedLocalData.current !== null) return cachedLocalData.current;
    const value = localStorage.getItem(key);
    const parsedValue = value ? JSON.parse(value) : null;
    cachedLocalData.current = parsedValue;
    return parsedValue;
  }, [key]);

  const clearValue = useCallback(
    (silent = false) => {
      if (!silent) {
        setLocalData(null);
      }
      cachedLocalData.current = null;
      localStorage.removeItem(key);
    },
    [key],
  );

  return {
    setLocalData: setValue,
    getLocalData: getValue,
    clearLocalData: clearValue,
    localData,
    cachedLocalData,
  };
};
