import { createContext, useContext, useState, useEffect } from "react";

// Create a context for user data
const UserContext = createContext();

// Create a provider component
// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  // State to store user currency preference, default to "EGP"
  const [prefCurrency, setPrefCurrency] = useState("EGP");
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);

  // On mount, check localStorage for cached data and set it if found
  useEffect(() => {
    const cachedCurrency = localStorage.getItem("prefCurrency");
    const cachedUserId = localStorage.getItem("userId");
    const cachedUserType = localStorage.getItem("userType");
    if (cachedCurrency) {
      setPrefCurrency(cachedCurrency);
    }
    if (cachedUserId) {
      setUserId(cachedUserId);
    }
    if (cachedUserType) {
      setUserType(cachedUserType);
    }
  }, []);

  // Function to update preferred currency
  const updatePrefCurrency = (currency) => {
    setPrefCurrency(currency);
    localStorage.setItem("prefCurrency", currency); // Cache in localStorage
  };

  const updateUserId = (id) => {
    setUserId(id);
    localStorage.setItem("userId", id); // Persist userId
  };

  const updateUserType = (user_type) => {
    setUserType(user_type);
    localStorage.setItem("userType", user_type); // Persist userType
  };
  const logout = () => {
    // Clear all relevant user data from state and localStorage
    setPrefCurrency("EGP");
    setUserId(null);
    setUserType(null);
    localStorage.removeItem("prefCurrency");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");

    // Optionally, clear cookies where JWT might be stored
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  return (
    <UserContext.Provider
      value={{
        prefCurrency,
        updatePrefCurrency,
        userId,
        updateUserId,
        userType,
        updateUserType,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useUser = () => useContext(UserContext);
