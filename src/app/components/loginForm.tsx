"use client";

import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../lib/firebaseConfig";
import Image from "next/image";

interface LoginFormProps {
  handleEnableRegisterView: () => void;
}

type Inputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ handleEnableRegisterView }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password } = data;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <h3 className="font-bold text-2xl mb-4 text-black">Login with </h3>
      <div className="flex justify-center space-x-4 mt-4">
        <button
          className="btn btn-circle btn-outline w-16 h-16"
          onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
        >
          <Image
            src="/assets/icons/facebook.png"
            alt="Facebook"
            width={14}
            height={14}
            className="w-14 h-14"
          />
        </button>
        <button
          className="btn btn-circle btn-outline w-16 h-16"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <Image
            src="/assets/icons/google.png"
            width={20}
            height={18}
            alt="Google"
            className="w-20 h-18"
          />
        </button>
      </div>

      <div className="divider text-black">OR</div>

      <form onSubmit={handleSubmit(onSubmit)}>
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
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <button type="submit" className="btn btn-outline mb-6 w-full">
          Login
        </button>
      </form>

      <p className="mb-6 text-black">
        New here?{" "}
        <a
          href="#"
          className="link link-primary"
          onClick={handleEnableRegisterView}
        >
          Register
        </a>
      </p>
    </>
  );
};

export default LoginForm;
