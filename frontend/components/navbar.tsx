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
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [maxCapacityPopupOpen,setMaxCapacityPopupOpen]=useState<boolean>(false);
  const [roomIdPopupOpen,setRoomIdPopupOpen]=useState<boolean>(false);
  const [joinRoomId,setJoinRoomId]=useState<string>("");
  const [maxCapacity, setMaxCapacity] = useState<number>(1);
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
  
  const createRoom=async()=>{
    try{
      const response=await axios.post(url+"/api/room/create",{maxCapacity},{withCredentials:true});
      if(response.data.success){
        localStorage.setItem("isOwner","true");
        router.push(`/editor/${response.data.roomId}`);
      }
      else{
        toast.error("Failed to create room.");
      }
    }
    catch(error:any){
      console.log(error);
      toast.error(error.message);
    }
    }
    const joinRoom=async()=>{
      try{
      const response=await axios.post(url+"/api/room/join",{roomId:joinRoomId},{withCredentials:true});
      if(response.data.success){
        router.push(`/editor/${joinRoomId}`);
      }
      else{
        toast.error(response.data.message);
      }
    }
      catch(error:any){
        console.log(error);
        toast.error(error.message);
      }
    }
  return (
    <>
    <nav className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-900 bg-black text-white relative z-10">
     
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-semibold cursor-pointer tracking-tight select-none"
      >
        CodeSync <span className="text-[#f5f5dc]">AI</span>
      </h1>

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
              onClick={() => setRoomIdPopupOpen(true)}
              className="border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 hover:text-white transition-all cursor-pointer"
            >
              Join Room
            </button>

            <button
              onClick={() => setMaxCapacityPopupOpen(true)}
              className="bg-[#f5f5dc] text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#e6e6cc] transition-all cursor-pointer"
            >
              Create Room
            </button>
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
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
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all duration-150 text-left group cursor-pointer z-10"
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
    {maxCapacityPopupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setMaxCapacityPopupOpen(false)}
    />

    <div className="relative z-10 w-96 rounded-2xl bg-black border border-gray-900 p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <h2 className="text-xl font-semibold text-white mb-2">
        Create Room
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Select the maximum number of participants allowed in this room.
      </p>

      <input
        type="range"
        min="1"
        max="10"
        value={maxCapacity}
        onChange={(e) => setMaxCapacity(Number(e.target.value))}
        className="w-full accent-[#f5f5dc] cursor-pointer"
      />

      <div className="mt-4 flex items-center justify-between">
        <span className="text-gray-400 text-sm">
          Maximum Capacity
        </span>

        <span className="px-3 py-1 rounded-lg bg-gray-950 border border-gray-800 text-[#f5f5dc] font-semibold">
          {maxCapacity}
        </span>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={createRoom}
          className="flex-1 bg-[#f5f5dc] text-black py-2.5 rounded-lg font-medium hover:bg-[#e6e6cc] transition-all cursor-pointer"
        >
          Create Room
        </button>

        <button
          onClick={() => setMaxCapacityPopupOpen(false)}
          className="flex-1 border border-gray-800 text-gray-300 py-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{roomIdPopupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setRoomIdPopupOpen(false)}
    />

    <div className="relative z-10 w-96 rounded-2xl bg-black border border-gray-900 p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <h2 className="text-xl font-semibold text-white mb-2">
        Join Room
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Enter the room ID to join an existing room.
      </p>

      <input
        type="text"
        placeholder="Room ID"
        value={joinRoomId}
        onChange={(e) => setJoinRoomId(e.target.value)}
        className="w-full bg-gray-950 border border-gray-800 text-gray-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-3 mt-8">
        <button
          onClick={joinRoom}
          className="flex-1 bg-[#f5f5dc] text-black py-2.5 rounded-lg font-medium hover:bg-[#e6e6cc] transition-all cursor-pointer"
        >
          Join Room
        </button>

        <button
          onClick={() => setRoomIdPopupOpen(false)}
          className="flex-1 border border-gray-800 text-gray-300 py-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
</>)};
