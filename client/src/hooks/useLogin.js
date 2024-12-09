import axios from "axios";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUserId, updateUserType } = useUser();
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "/api/login",
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      updateUserId(response.data.id);
      updateUserType(response.data.role);
      const objec = {success:true, role:response.data.role};
      return objec;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed"); // Capture error details
      throw err; // Re-throw the error for handling in the component
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  return { error, loading, login };
};
