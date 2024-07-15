import React, { useContext, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { backendUrl } from "../App";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../Contexts/AppContext";
import { AppContextType } from "../types";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "All passwords are atleast of length 6"),
});

export type loginFormType = z.infer<typeof loginFormSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormType>({ resolver: zodResolver(loginFormSchema) });
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const navigate = useNavigate();
  const { setLoggedInUser, loggedInUser } = useContext(
    AppContext
  ) as AppContextType;

  const onsubmit: SubmitHandler<{
    email: string;
    password: string;
  }> = async (data) => {
    try {
      setLoginError("");
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      console.log(response);
      setLoggedInUser(response.data.user);
      navigate("/");
    } catch (error: any) {
      setLoginError(
        (error.response.data as { success: boolean; message: string }).message
      );
    }
  };

  if (loggedInUser !== null) return <Navigate to="/" />;

  return (
    <>
      <div className="flex flex-col p-4 border rounded-lg shadow-md my-16 mx-4 md:w-[60%] md:mx-auto lg:w-[40%]">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-semibold">Welcome to Fabrikan</span>
          <span className="text-gray-600">Login</span>
        </div>
        <form
          onSubmit={handleSubmit((data) => onsubmit(data))}
          className="flex flex-col my-4 gap-2"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              type="email"
              name="email"
              id="email"
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              type={isShowPassword ? "text" : "password"}
              id="password"
            />
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>
          {loginError !== "" && (
            <div className="text-red-500">{loginError}</div>
          )}
          <div className="flex items-center gap-1">
            <Checkbox
              checked={isShowPassword}
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
            <span className="font-semibold">Show password</span>
          </div>
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Login;
