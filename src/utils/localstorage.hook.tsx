import { useCallback } from "react";

const useLocalStorage = () => {
  const fetch = useCallback((key: string) => {
    return localStorage.getItem(key);
  }, []);
  const wipe = useCallback(() => {
    return localStorage.clear();
  }, []);
  const set = useCallback((key: string, values: unknown) => {
    return localStorage.setItem(key, JSON.stringify(values));
  }, []);
  return {
    getLocalStorage: fetch,
    wipeLocalStorage: wipe,
    setLocalStorage: set,
  };
};

export default useLocalStorage;
