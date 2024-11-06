import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create a context for user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // States to store user data
  const [userType, setUserType] = useState(null);
  const [prefCurrency, setPrefCurrency] = useState(
    () => localStorage.getItem("prefCurrency") || "EGP"
  );
  // Fetch user data on initial load (or from an API)
  useEffect(() => {
    axios
      .get("/api/user-data") // Replace with your API endpoint to fetch user data
      .then((response) => {
        const data = response.data;
        setUserType(data.userType);
        setPrefCurrency(data.prefCurrency);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  // Function to update userType
  const updateUserType = (type) => setUserType(type);

  // Function to update preferred currency
  const updatePrefCurrency = (currency) => {
    setPrefCurrency(currency);
    localStorage.setItem("prefCurrency", currency); // Cache in localStorage
  };
  return (
    <UserContext.Provider
      value={{
        userType,
        prefCurrency,
        updateUserType,
        updatePrefCurrency,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useUser = () => useContext(UserContext);
