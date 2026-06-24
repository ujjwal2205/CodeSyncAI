"use client";

import { useEffect, useState,useRef } from "react";
import { useStore } from "@/context/StoreContext";
import axios from "axios";
import {toast} from "react-toastify";
export default function ChatPanel({roomId,code}:any) {
  const {url,userDetails,socket}=useStore();
  const [activeTab, setActiveTab] = useState<"chat" | "ai">("chat");
  const [groupMessages,setGroupMessages]=useState<any[]>([]);
  const [aiLoading,setAiLoading] = useState<boolean>(false);
  const [aiMessages,setAIMessages]=useState<any[]>([]);
  const [groupMessage,setGroupMessage]=useState<string>("");
  const [aiMessage,setAiMessage]=useState<string>("");
  const groupEndRef = useRef<HTMLDivElement | null>(null);
const aiEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(()=>{
    const fetch=async()=>{
      try{
    const [response,response2]=await Promise.all([axios.post(url+"/api/chat/get-messages",{roomId,type:"group"},{withCredentials:true}),
      axios.post(url+"/api/chat/get-messages",{roomId,type:"ai"},{withCredentials:true})
    ]);
    if(response.data.success){
      setGroupMessages(response.data.messages);
    }
    else{
      toast.error(response.data.message);
    }
    if(response2.data.success){
      setAIMessages(response2.data.messages);
    }
    else{
      toast.error(response.data.message);
    }
    }
    catch(error:any){
      console.log(error);
      toast.error(error.message);
    }}
    fetch();
  },[roomId]);
 const scrollToBottom = (smooth=true) => {
  setTimeout(()=>{
    const ref = activeTab === "chat" 
      ? groupEndRef 
      : aiEndRef;

    ref.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block:"end"
    });
  },100);
};
useEffect(()=>{
  if(groupMessages.length > 0 || aiMessages.length > 0){
    setTimeout(()=>{
      scrollToBottom(false);
    },300);
  }
},[activeTab]);
  useEffect(()=>{
  scrollToBottom(true);
},[groupMessages, aiMessages, aiLoading, activeTab]);
useEffect(()=>{
 socket.on("receiveGroupMessage",(data:any)=>{
 setGroupMessages((prev)=>[
  ...prev,
  data
 ]);
 })
 socket.on("receiveUserMessage",(data:any)=>{
  setAIMessages((prev)=>[
    ...prev,
    data
  ]);
  setAiLoading(true);
})
socket.on("receiveAiMessage",(data:any)=>{
  setAIMessages((prev)=>[
    ...prev,
    data
  ]);
  setAiLoading(false);
})
return ()=>{
  socket.off("receiveGroupMessage");
  socket.off("receiveUserMessage");
  socket.off("receiveAiMessage");
}

},[])
  const addGroupMessage=async(message:string)=>{
   try {
    const res=await axios.post(url+"/api/chat/addMessagesGroup",{roomId,message},{withCredentials:true});
    if(!res.data.success){
    toast.error(res.data.message);
    return;
    }
    setGroupMessages(prev=>[...prev,{
      message,
      senderId:{
        userName:userDetails.userName
      }
   }]);
   socket.emit("sendGroupMessage",{roomId,message});
   setGroupMessage("");
   } catch (error:any) {
    console.log(error);
    toast.error(error.message);
   }
  }
   const addAiMessage=async(message:string)=>{
    if(!message.trim()) return;
   try {
     setAiMessage("");
     
    setAiLoading(true);
    const res=await axios.post(url+"/api/chat/addMessagesAI",{roomId,message},{withCredentials:true});
    if(!res.data.success){
      toast.error(res.data.message);
      console.log(res.data.message);
      return;
    }
   
   } catch (error:any) {
    console.log(error);
    toast.error(error.message);
   }finally{
    setAiLoading(false);
   }
  }
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
            } hover:cursor-pointer`}
          >
            {tab === "chat" ? "Chat" : "AI Assist"}
          </button>
        ))}
      </div>
     {activeTab === "chat" && (
  <>
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
     {groupMessages.map((message, index) => {
  const isMe =
    message.senderId?.userName === userDetails?.userName;

  return (
    <div
      key={index}
      className={`flex mb-4 ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col ${
          isMe ? "items-end" : "items-start"
        } max-w-[80%]`}
      >
        {!isMe && (
          <span className="text-[11px] font-semibold text-gray-400 mb-1 ml-2">
            {message.senderId?.userName}
          </span>
        )}

        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm
          whitespace-pre-wrap break-all overflow-hidden
          ${
            isMe
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-[#1e1e1e] text-gray-100 rounded-bl-md border border-gray-700"
          }`}
        >
          {message.message}
        </div>
      </div>
    </div>
  );
})}
<div ref={groupEndRef}></div>
    </div>

    <div className="p-3 border-t border-gray-800">
      <div className="flex items-center gap-2 bg-[#111] border border-gray-800 rounded-lg px-2 py-1 focus-within:ring-1 focus-within:ring-blue-500">
        <input
          placeholder="Type a message..."
          value={groupMessage}
          onChange={(e)=>setGroupMessage(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none text-white placeholder-gray-500"
           onKeyDown={(e) => {
           if (e.key === "Enter") {
           addGroupMessage(groupMessage);
           }
           }}
          />
        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md text-sm cursor-pointer" onClick={()=>addGroupMessage(groupMessage)}>
          Send
        </button>
      </div>
    </div>
  </>
)}
 {activeTab === "ai" && (
  <>
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
     {aiMessages.map((message, index) => {
  const isMe = message.role === "user";

  return (
    <div
      key={index}
      className={`flex mb-4 ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col ${
          isMe ? "items-end" : "items-start"
        } max-w-[80%]`}
      >
        {isMe && (
          <span className="text-[11px] font-semibold text-blue-300 mb-1 mr-2">
            {message.senderId?.userName}
          </span>
        )}

        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm
          whitespace-pre-wrap break-all overflow-hidden
          ${
            isMe
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-[#1e1e1e] text-gray-100 rounded-bl-md border border-gray-700"
          }`}
        >
          {message.message}
        </div>
      </div>
    </div>
  );
})}
 {aiLoading && (
  <div className="flex justify-start mb-5 animate-fade-in">
    <div className="flex flex-col items-start max-w-[80%]">
 
      <div className="
        relative
        bg-[#111111]
        border border-zinc-800/80
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        px-4 py-3
        rounded-2xl
        rounded-tl-sm
        flex items-center gap-3.5
        overflow-hidden
      ">
        
  
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

        
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500/60 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </div>

      
        <span className="
          text-xs 
          text-zinc-400
          font-medium
          tracking-wider
          uppercase
          opacity-90
        ">
          AI is thinking
        </span>

      </div>

    </div>
  </div>
)}  
<div ref={aiEndRef}></div>
    </div>

    <div className="p-3 border-t border-gray-800">
      <div className="flex items-center gap-2 bg-[#111] border border-gray-800 rounded-lg px-2 py-1 focus-within:ring-1 focus-within:ring-blue-500">
        <input
          placeholder="Type a message..."
          value={aiMessage}
          onChange={(e)=>setAiMessage(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none text-white placeholder-gray-500"
           onKeyDown={(e) => {
           if (e.key === "Enter") {
           addAiMessage(aiMessage);
           }
           }}
          />
        

        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md text-sm cursor-pointer" onClick={()=>addAiMessage(aiMessage)}>
          Send
        </button>
      </div>
    </div>
  </>
)}

    </div>
  );
}