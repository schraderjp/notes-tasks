import { useState } from "react";

function useLocalStorage(key, initialValue) {
  // The state to store user's value
  // Pass the initial state function to useState so the logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or if none, return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, also return initialValue
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value of localStorage
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to localStorate
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(`Error:  ${error.message}`);
    }
  }
  return [storedValue, setValue];
}

export default useLocalStorage;