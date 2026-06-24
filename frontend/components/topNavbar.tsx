"use client";

import { useEffect, useState } from "react";
import MenuBar from "./menuBar";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from 'react-toastify';
import {useStore} from "@/context/StoreContext";
export default function TopNavbar({
  roomId,
  newFile,
  saveFile,
  runCommand,
  setShowChat,
  showChat,
  openFile,
  saveAsFile,
  setShowPreferences,
  runCode,
  isRunning,
  editorRef,
  setCode
}: any) {
  const [showUsers, setShowUsers] = useState(false);
  const [users,setUsers]=useState<any[]>([]);
  const [owner,setOwner]=useState<boolean>(false);
  const {url,socket,userDetails}=useStore();
  const router=useRouter();
  const leaveRoom=async()=>{
  try{
    const response=await axios.post(`${url}/api/room/leave`,{roomId},{withCredentials:true});
    if(response.data.success){
      const res=await axios.post(`${url}/api/chat/deleteChats`,{roomId},{withCredentials:true});
      if(!res.data.success){
        console.log(res.data.message);
      }
      socket.disconnect();
      if(localStorage.getItem("isOwner")!==null){
        localStorage.removeItem("isOwner");
      }
      router.push("/");
    }
    else{
      console.log(response.data.message);
      toast.error(response.data.message);
    }
  }
  catch(error:any){
    console.log(error);
    toast.error(error.message);
  }
  }
  const kick=async(userId:string)=>{
    try {
      const response=await axios.post(url+"/api/room/kick",{roomId,userId},{withCredentials:true});
      if(!response.data.success){
        console.log(response.data.message);
        toast.error(response.data.message);
        return;
      }
      socket.emit("kick",{roomId,userId});
    } catch (error:any) {
      console.log(error);
      toast.error(error.message);
    }
  }
  useEffect(()=>{
    socket.on("roomUsers",(users:any)=>{
      setUsers(users);
    })
    return ()=>{
      socket.off("roomUsers");
    }
  },[]);
  useEffect(()=>{
    if(localStorage.getItem("isOwner")!==null){
      setOwner(true);
    }
  },[]);
  return (
    <div className="flex justify-between items-center px-5 py-2 z-1000 border-b border-gray-800 bg-[#0b0b0b]/80 backdrop-blur-md">

      <div className="flex items-center gap-6">

        <h1 className="text-lg font-semibold tracking-wide text-white cursor-pointer" onClick={leaveRoom}>
          CodeSync AI
        </h1>

        <div className="flex items-center">
          <MenuBar
            newFile={newFile}
            saveFile={saveFile}
            runCommand={runCommand}
            openFile={openFile}
            saveAsFile={saveAsFile}
            setShowPreferences={setShowPreferences}
            editorRef={editorRef}
            roomId={roomId}
            setCode={setCode}
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-sm bg-[#111] px-3 py-1.5 rounded-md border border-gray-800">
        <span className="text-gray-400">Room ID:</span>
        <span className="text-white font-medium">{roomId}</span>
        <button
          onClick={() => navigator.clipboard.writeText(roomId)}
          className="ml-2 text-gray-400 hover:text-white transition"
        >
          📋
        </button>
      </div>

      <div className="flex items-center gap-3">

       
        <button
          onClick={() => setShowChat((prev: boolean) => !prev)}
          className={`flex items-center gap-2 h-9 px-3.5 rounded-lg text-sm font-medium border transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950
            ${
              showChat
                ? "bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)] focus:ring-blue-500"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 focus:ring-zinc-700"
            }
          `}
        >
          <span className="text-base">{showChat ? "💬" : "🗨️"}</span>
          <span>Chat</span>
        </button>

        {/* Users Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="flex items-center gap-2 h-9 px-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-zinc-400 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            <span>👥</span>
            <span>Users</span>
          </button>

          {showUsers && (
            <div className="absolute right-0 mt-2 w-52 bg-zinc-900 backdrop-blur-md border border-zinc-800/80 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-800/60">
                Active Users
              </div>

              <div className="p-1.5 space-y-0.5">
               

                {users.map((user: any) => (
  <div
  key={user._id}
  className="px-2.5 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 rounded-md cursor-pointer transition-colors flex items-center justify-between"
>
  <span className="truncate max-w-[90px]">
    {user.userName}
  </span>

  <div className="flex items-center gap-1.5 ml-2">
    {user.userName === userDetails.userName && (
      <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
        You
      </span>
    )}

    {user.isOwner && (
      <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
        Host
      </span>
    )}

    {owner && !user.isOwner && (
      <button
        className="text-[10px] font-semibold bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 hover:bg-red-500/20 transition cursor-pointer"
        onClick={()=>kick(user._id)}
      >
        Kick
      </button>
    )}
  </div>
</div>
))}
              </div>
            </div>
          )}
        </div>

        <button
          className={`flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
            isRunning
              ? "bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.15)] focus:ring-emerald-500 cursor-pointer"
          }`}
          onClick={runCode}
          disabled={isRunning}
        >
          <span>▶</span>
          <span>Run</span>
        </button>

        <button
          onClick={leaveRoom}
          className="flex items-center gap-2 h-9 px-3.5 rounded-lg text-sm font-medium border border-red-950 bg-red-950/20 text-red-400 hover:text-red-300 hover:bg-red-900/30 hover:border-red-800 transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          <span>🚪</span>
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}