import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // State to store user currency preference, default to "EGP"
  const [prefCurrency, setPrefCurrency] = useState("EGP");

  // On mount, check localStorage for prefCurrency and set it if found
  useEffect(() => {
    const cachedCurrency = localStorage.getItem("prefCurrency");
    if (cachedCurrency) {
      setPrefCurrency(cachedCurrency);
    }
  }, []);

  // Function to update preferred currency
  const updatePrefCurrency = (currency) => {
    setPrefCurrency(currency);
    localStorage.setItem("prefCurrency", currency); // Cache in localStorage
  };

  return (
    <UserContext.Provider
      value={{
        prefCurrency,
        updatePrefCurrency,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useUser = () => useContext(UserContext);
