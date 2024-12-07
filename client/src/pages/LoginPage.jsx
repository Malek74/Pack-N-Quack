import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin } = useContext(AuthContext);
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(username, password);
      console.log(data);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err.message);
    }
  };

  return (
    <div className="form-wraper flex justify-center items-center bg-[url('public/assets/images/Background.jpg')]  bg-no-repeat bg-cover">
      <form
        onSubmit={(e) => handleLogin(e)}
        className=" flex flex-col  bg-white gap-8 my-2 lg:m-8  rounded-2xl shadow-md max-w-[350px] p-2  lg:max-w-[500px] lg:py-16 lg:px-10  "
      >
        <h1 className="text-3xl font-medium">Sign in</h1>

        <div className="form-group">
          <label
            htmlFor="Username"
            className="text-lg font-normal text-muted-foreground"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="p-4  rounded-lg w-full min-h14 border-2 "
          />
        </div>

        <div className="form-group">
          <div className="flex justify-between    ">
            <label
              htmlFor="Password"
              className="text-lg font-normal text-muted-foreground "
            >
              {" "}
              Password{" "}
            </label>
            <Button
              type="button"
              variant="ghost"
              className=" text-muted-foreground bg-transparent "
              onClick={toggleShowPassword}
            >
              {" "}
              <i
                className={
                  showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
                }
              ></i>{" "}
              &nbsp; {showPassword ? "Hide" : "Show"}
            </Button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="Password"
            className="p-4 rounded-lg  w-full min-h-14 border-2 "
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="button-wraper ">
          <button
            type="submit"
            className={`rounded-lg text-primary-foreground bg-primary min-h-14 w-full ${
              loading ? "disabled" : ""
            }`}
          >
            Sign in
          </button>
        </div>

        <p className=" text-md text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-accent-foreground underline"
            onClick={handleClick}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
