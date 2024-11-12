"use client";

import { createRef } from "react";
import LoginDialog from "./components/loginDialog";
import ChatAssistant from "./components/chatAssistant";

export default function Home() {
  const bgImg = "/assets/images/travelAI2.webp";
  const dialogRef = createRef<HTMLDialogElement>();

  const handleShowModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-6xl font-bold">
              Your Next Adventure <br /> Starts Here
            </h1>
            <p className="mb-6 text-xl font-bold">
              From choosing destinations to finalizing routes, <br /> let{" "}
              <b>AI</b> simplify your travel planning.
            </p>
            <button className="btn btn-wide text-xl" onClick={handleShowModal}>
              Get Started
            </button>

            <LoginDialog ref={dialogRef} />

            <ChatAssistant />
          </div>
        </div>
      </div>
    </>
  );
}
