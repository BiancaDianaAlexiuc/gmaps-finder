"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

interface RegisterFormProps {
  handleDisableRegisterView: () => void;
}

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  handleDisableRegisterView,
}) => {
  const { data: session } = useSession();

  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password } = form;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(userCredential.user);

      alert(
        "Registration successful! Please check your email to verify your account."
      );

      handleDisableRegisterView();
    } catch (error: unknown) {
      console.error("Error during registration:", error);
      alert("Error during registration: " + error);
    }
  };

  return (
    <>
      <h3 className="font-bold text-2xl mb-4 text-black">Create an account </h3>

      <form onSubmit={handleSubmit(formSubmit)}>
        <label className="input input-bordered flex items-center gap-2 mb-6 text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            className="grow text-black"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </label>

        <label className="input input-bordered flex items-center gap-2 mb-6 text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            className="grow text-black"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </label>

        <label className="input input-bordered flex items-center gap-2 mb-6 text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </label>

        <label className="input input-bordered flex items-center gap-2 mb-6 text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            placeholder="Re-Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </label>
        <button
          type="submit"
          className="btn btn-outline mb-6 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mb-6 text-black">
        Already have an account?{" "}
        <a
          href="#"
          className="link link-primary"
          onClick={handleDisableRegisterView}
        >
          Login
        </a>
      </p>
    </>
  );
};

export default RegisterForm;
