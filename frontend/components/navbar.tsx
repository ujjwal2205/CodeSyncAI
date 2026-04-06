"use client";

import { useRouter } from "next/navigation";
import {useStore} from "@/context/StoreContext"
export default function Navbar() {
  const router = useRouter();
 const {isLoggedIn}=useStore();

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-black text-white">
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-semibold cursor-pointer"
      >
        CodeSync AI
      </h1>

      <div className="flex items-center gap-4">
        
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => router.push("/login")}
              className="text-gray-300 hover:text-white cursor-pointer"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/login")}
              className="bg-[#f5f5dc] text-black px-5 py-2 rounded-lg font-medium hover:opacity-90 cursor-pointer"
            >
              Get Started
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/join-room")}
              className="border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-900 cursor-pointer"
            >
              Join Room
            </button>

            <button
              onClick={() => router.push("/create-room")}
              className="bg-[#f5f5dc] text-black px-5 py-2 rounded-lg font-medium hover:opacity-90 cursor-pointer"
            >
              Create Room
            </button>
          </>
        )}
      </div>
    </nav>
  );
}