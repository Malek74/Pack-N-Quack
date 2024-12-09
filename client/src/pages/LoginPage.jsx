import { useState } from "react";
import LoginForm from "@/components/forms/LoginForm";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import UsernameForm from "@/components/forms/UsernameForm";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { Link } from "react-router-dom";
import GuideButton from "@/components/guideComponents/popMessage";

export default function LoginPage() {
  const [step, setStep] = useState("login");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useLogin();
  const { userType } = useUser();
  const handleLogin = async (values) => {
    try {
      console.log(values);
      const objec = await login(values.username, values.password);
      if (objec.success) {
        if (objec.role === "Admin") {
          navigate("/admin", { replace: true });
        }
        else{
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials",
        variant: "destructive", // Error variant
      });
    }
  };
  const handleForgotPassword = async (username) => {
    try {
      setUsername(username);
      await axios.post("/api/forgotPassword", { username });
      toast({
        title: "OTP Sent",
        description: `An OTP has been sent to the email associated with ${username}.`,
        variant: "success", // Success variant
      });
      setStep("resetPassword");
    } catch (error) {
      toast({
        title: "Failed to Send OTP",
        description:
          error.response?.data?.message ||
          "Could not send OTP. Please try again.",
        variant: "destructive", // Error variant
      });
    }
  };

  const handleResetPassword = async (values) => {
    try {
      await axios.post("/api/OTPPassword", {
        otp: values.otp,
        newPassword: values.newPassword,
        username: username,
      });
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. Please log in.",
        variant: "success", // Success variant
      });
      setStep("login");
    } catch (error) {
      toast({
        title: "Password Reset Failed",
        description:
          error.response?.data?.message ||
          "Failed to reset password. Please check the OTP and try again.",
        variant: "destructive", // Error variant
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white bg-[url('public/assets/images/Background.jpg')] bg-cover bg-no-repeat">
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
