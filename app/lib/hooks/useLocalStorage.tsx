export const useLocalStorage = (): {
  getLocalStorage: (key: string) => string | null;
  setLocalStorage: (key: string, value: string) => void;
} => {
  return { getLocalStorage: window.localStorage.getItem, setLocalStorage: window.localStorage.setItem };
};
