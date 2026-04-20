"use client";

import { useState } from "react";

export default function ChatPanel() {
  const [activeTab, setActiveTab] = useState<"chat" | "ai">("chat");

  return (
    <div className="h-full w-full min-w-[260px] border-l border-gray-800 flex flex-col bg-[#0b0b0b]">
      <div className="flex border-b border-gray-800 text-sm">
        {["chat", "ai"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 capitalize transition font-medium ${
              activeTab === tab
                ? "bg-[#111] text-white border-b-2 border-blue-500"
                : "text-gray-500 hover:text-white"
            }`}
          >
            {tab === "chat" ? "Chat" : "AI Assist"}
          </button>
        ))}
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-3 text-sm">
        
        <div className="flex">
          <div className="bg-gray-800 px-3 py-2 rounded-lg max-w-[80%]">
            Hello 👋
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-blue-600 px-3 py-2 rounded-lg max-w-[80%]">
            Hi bro!
          </div>
        </div>

      </div>

      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-2 bg-[#111] border border-gray-800 rounded-lg px-2 py-1 focus-within:ring-1 focus-within:ring-blue-500">
          
          <input
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm outline-none text-white placeholder-gray-500"
          />

          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md text-sm">
            Send
          </button>

        </div>
      </div>

    </div>
  );
}