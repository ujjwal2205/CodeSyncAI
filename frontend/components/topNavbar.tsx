"use client";

import { useState } from "react";
import MenuBar from "./menuBar";

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
  isRunning
}: any) {
  const [showUsers, setShowUsers] = useState(false);
  
  return (
    <div className="flex justify-between items-center px-5 py-2 z-1000 border-b border-gray-800 bg-[#0b0b0b]/80 backdrop-blur-md">

      <div className="flex items-center gap-6">

        <h1 className="text-lg font-semibold tracking-wide text-white">
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
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-200
            ${
              showChat
                ? "bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-md shadow-blue-900/30"
                : "bg-[#111] border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
            }
          `}
        >
          {showChat ? "💬 Chat" : "🗨️ Chat"}
        </button>

        {/* Users */}
        <div className="relative">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="px-3 py-1.5 bg-[#111] border border-gray-700 hover:bg-gray-800 rounded-md text-sm transition"
          >
            👥 Users
          </button>

          {showUsers && (
            <div className="absolute right-0 mt-2 w-44 bg-[#111] border border-gray-800 rounded-lg shadow-xl  overflow-hidden">

              <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-800">
                Active Users
              </div>

              <div className="p-2 text-sm hover:bg-gray-800 rounded-md cursor-pointer">
                User_1
              </div>
              <div className="p-2 text-sm hover:bg-gray-800 rounded-md cursor-pointer">
                User_2
              </div>

            </div>
          )}
        </div>

        
        <button className={`px-4 py-2 rounded text-white ${
    isRunning ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
  }`}
        onClick={runCode}
        disabled={isRunning}
         >
          ▶ Run
        </button>

      </div>
    </div>
  );
}