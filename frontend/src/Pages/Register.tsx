import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { isStrongPassword } from "../utils";
import { Checkbox } from "../components/ui/checkbox";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";

const registerFormSchema = z
  .object({
    email: z.string().email().toLowerCase(),
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
    password: z
      .string()
      .min(6, "Password should be atleast 6 chars long")
      .refine((value) => isStrongPassword(value), {
        message: "Please enter a strong password",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

export type registerFormType = z.infer<typeof registerFormSchema>;

const Register = () => {
  // register fields - email , password, confirmPassword, firstName , lastName
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<registerFormType>({ resolver: zodResolver(registerFormSchema) });
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");
  const navigate = useNavigate();

  const onsubmit: SubmitHandler<{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }> = async (data) => {
    try {
      setRegisterError("");
      await axios.post(
        `${backendUrl}/api/auth/register`,
        {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
        },
        { withCredentials: true }
      );
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setRegisterError(
        (error.response.data as { success: boolean; message: string }).message
      );
    }
  };

  return (
    <>
      <div className="flex flex-col p-4 border rounded-lg shadow-md my-16 mx-4 md:w-[60%] md:mx-auto lg:w-[40%]">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-semibold">Welcome to Fabrikan</span>
          <span className="text-gray-600">Register to get started</span>
        </div>
        <form
          onSubmit={handleSubmit((data) => onsubmit(data))}
          className="my-4 flex flex-col gap-2"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              name="email"
              id="email"
              type="email"
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-1 lg:flex-1">
              <Label htmlFor="firstName">First name</Label>
              <Input
                {...register("firstName")}
                type="text"
                name="firstName"
                id="firstName"
              />
              {errors.firstName && (
                <div className="text-red-500">{errors.firstName.message}</div>
              )}
            </div>
            <div className="flex flex-col gap-1 lg:flex-1">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                {...register("lastName")}
                type="text"
                name="lastName"
                id="lastName"
              />
            </div>
            {errors.lastName && (
              <div className="text-red-500">{errors.lastName.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Enter password</Label>
            <Input
              {...register("password")}
              type={isShowPassword ? "text" : "password"}
              name="password"
              id="password"
            />
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              {...register("confirmPassword")}
              type={isShowPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
            />
            {errors.confirmPassword && (
              <div className="text-red-500">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
          {registerError !== "" && (
            <div className="text-red-500">{registerError}</div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              checked={isShowPassword}
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
            <span>Show password</span>
          </div>
          <div className="flex items-center gap-1 my-2">
            <span className="font-semibold">Already have an account?</span>
            <Link
              className="text-gray-700 hover:text-black hover:duration-300"
              to="/login"
            >
              Click here
            </Link>
          </div>
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Register;
