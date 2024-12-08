import React, { useState } from "react";
import LoginForm from "@/components/forms/LoginForm";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import UsernameForm from "@/components/forms/UsernameForm";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { useToast } from "@/hooks/use-toast";
export default function LoginPage() {
  const [step, setStep] = useState("login");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useLogin();
  const handleLogin = async (values) => {
    try {
      console.log(values);
      const success = await login(values.username, values.password);
      if (success) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials",
        variant: "destructive", // Error variant
      });
    }
  };
  const handleForgotPassword = (username) => {
    setUsername(username);
    setStep("resetPassword");
  };

  const handleResetPassword = (data) => {
    console.log("Reset password data:", { username, ...data });
    // Perform reset password logic here
    setStep("login");
  };

  return (
    <div className="form-wrapper flex justify-center items-center bg-[url('public/assets/images/Background.jpg')] bg-no-repeat bg-cover">
      {step === "login" && (
        <LoginForm
          onForgotPassword={() => setStep("enterUsername")}
          onSubmit={handleLogin}
        />
      )}
      {step === "enterUsername" && (
        <UsernameForm
          onBack={() => setStep("login")}
          onSubmit={handleForgotPassword}
        />
      )}
      {step === "resetPassword" && (
        <ResetPasswordForm
          onBack={() => setStep("enterUsername")}
          onSubmit={handleResetPassword}
        />
      )}
    </div>
  );
}
