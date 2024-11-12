"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { MapProvider } from "../providers/map-provider";
import MapComponent from "../components/map";

export default function Home() {
  // let bgImg = "/assets/images/travelAI.webp";
  const { data: session, status } = useSession();

  const handleSignOut = (e: React.FormEvent) => {
    e.preventDefault();
    signOut({ callbackUrl: "/" });
  };

  console.log("data", session, status);

  return (
    <div>
      {/* Navbar at the top of the page */}
      <div className="navbar bg-base-100 fixed top-0 left-0 w-full z-50 shadow">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">AI Travel Planner</a>
        </div>
        <p className="mr-2"> {session?.user?.name || " "}</p>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  alt="Tailwind CSS Navbar component"
                  src={
                    session?.user?.image ||
                    "/assets/images/user-placeholder.webp"
                  }
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a href="#" onClick={handleSignOut}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="hero min-h-screen w-full">
        <div className="hero-content text-neutral-content text-center w-full">
          <div className="w-full">
            <MapProvider>
              <MapComponent />
            </MapProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
