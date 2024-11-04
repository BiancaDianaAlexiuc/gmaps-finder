"use client";

import { forwardRef, useState } from "react";
import { signIn } from "next-auth/react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";

const LoginDialog = forwardRef<HTMLDialogElement>((props, dialogRef) => {
  const [isRegisterview, setIsRegisterView] = useState(false);

  const handleEnableRegisterView = () => {
    setIsRegisterView(true);
    console.log("isRegisterView?", isRegisterview);
  };

  const handleDisableRegisterView = () => {
    setIsRegisterView(false);
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box  w-full max-w-6xl h-full max-h-[800px]">
        <form method="dialog">
          <button className="btn btn-md btn-square btn-outline  absolute right-2 top-2 text-black text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </form>

        <div className="flex h-full">
          <div
            className="w-1/2 h-full rounded-lg"
            style={{
              backgroundImage: `url(/assets/images/travelAI-bus.webp)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></div>

          <div className="w-1/2 h-full p-6 flex flex-col justify-center">
            {!isRegisterview ? (
              <LoginForm handleEnableRegisterView={handleEnableRegisterView} />
            ) : (
              <RegisterForm
                handleDisableRegisterView={handleDisableRegisterView}
              />
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default LoginDialog;
