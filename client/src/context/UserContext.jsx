import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // State to store user currency preference, default to "EGP"
  const [prefCurrency, setPrefCurrency] = useState("EGP");
  // const [userId, setUserId] = useState("6702cde57d7e2444d9713d8d");
  // const [userType, setUserType] = useState("tourist");
  // const [userId, setUserId] = useState("66fb241366ea8f57d59ec6db");
  // const [userType, setUserType] = useState("tourGuide");
  const [userId, setUserId] = useState("670002186379370f9748adb5");
  const [userType, setUserType] = useState("advertisers");
  // const [userId, setUserId] = useState("6703ba52daf9eae5ef55344c");
  // const [userType, setUserType] = useState("seller");

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

  const updateUserId = (id) => {
    setUserId(id);
    localStorage.setItem("userId", id); // Cache in localStorage
  };

  return (
    <UserContext.Provider
      value={{
        prefCurrency,
        updatePrefCurrency,
        userId,
        updateUserId,
        userType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useUser = () => useContext(UserContext);
