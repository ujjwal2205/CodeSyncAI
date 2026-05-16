"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { User, LogOut } from "lucide-react";
import axios from "axios";
import {toast} from "react-toastify";
export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, openLogin, setOpenLogin, setOpenSignup,url,setIsLoggedIn } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response=await axios.post(url+"/api/user/logout",{},{withCredentials:true});
      if(response.data.success){
      setIsLoggedIn(false);
      toast.success("Logged out successfully!");
      }
      else{
        toast.error("Failed to log out.");
      }
      setIsDropdownOpen(false);
      
    } catch (error:any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-900 bg-black text-white relative z-50">
      {/* Logo */}
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-semibold cursor-pointer tracking-tight select-none"
      >
        CodeSync <span className="text-[#f5f5dc]">AI</span>
      </h1>

      {/* Action Buttons / Auth State */}
      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => setOpenLogin(true)}
              className="text-gray-400 hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Login
            </button>

            <button
              onClick={() => setOpenSignup(true)}
              className="bg-[#f5f5dc] text-black px-5 py-2 rounded-lg font-medium text-sm hover:bg-[#e6e6cc] transition-all cursor-pointer"
            >
              Get Started
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/join-room")}
              className="border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 hover:text-white transition-all cursor-pointer"
            >
              Join Room
            </button>

            <button
              onClick={() => router.push("/create-room")}
              className="bg-[#f5f5dc] text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#e6e6cc] transition-all cursor-pointer"
            >
              Create Room
            </button>
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {/* Profile Trigger Icon */}
              <button
                className={`p-2 rounded-full border transition-all duration-200 cursor-pointer ${
                  isDropdownOpen 
                    ? "border-[#f5f5dc] bg-gray-950 text-[#f5f5dc]" 
                    : "border-gray-800 hover:border-gray-700 bg-transparent text-gray-400 hover:text-white"
                }`}
              >
                <User size={18} />
              </button>
              <div
                className={`absolute right-0 mt-2 w-36 bg-black border border-gray-900 rounded-xl shadow-2xl transition-all duration-200 origin-top-right transform p-1.5 ${
                  isDropdownOpen
                    ? "opacity-100 visible scale-100 translate-y-0"
                    : "opacity-0 invisible scale-95 -translate-y-1"
                }`}
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all duration-150 text-left group cursor-pointer"
                >
                  <span className="font-medium">Logout</span>
                  <LogOut size={14} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}