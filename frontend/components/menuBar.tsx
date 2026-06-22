"use client";

import { useState } from "react";
import {useStore} from "@/context/StoreContext"
import axios from "axios";
import {toast} from 'react-toastify';
export default function MenuBar({ newFile, saveFile, runCommand, openFile,saveAsFile,setShowPreferences,editorRef,roomId }: any) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const {url}=useStore();
  const undo=async()=>{
    try{
   await runCommand("undo");
   const code=editorRef.current?.getValue();
   const response=await axios.post(url+"/api/room/code-change",{roomId,code},{withCredentials:true});
   if(!response.data.success){
   toast.error("Can't able to save change to DB");
   }
  }
  catch(error:any){
    console.log(error);
    toast.error(error.message);
  }
  }
  const redo=async()=>{
    try{
   await runCommand("redo");
   const code=editorRef.current?.getValue();
   const response=await axios.post(url+"/api/room/code-change",{roomId,code},{withCredentials:true});
   if(!response.data.success){
   toast.error("Can't able to save change to DB");
   }
  }
  catch(error:any){
    console.log(error);
    toast.error(error.message);
  }
  }
  return (
    <div className="flex gap-4 text-sm text-gray-300 relative z-10000">
      {["File", "Edit", "Selection"].map((menu) => (
        <div key={menu} className="relative">
          <span
            onClick={() =>
              setActiveMenu(activeMenu === menu ? null : menu)
            }
            className="cursor-pointer hover:text-white"
          >
            {menu}
          </span>

          {activeMenu === menu && (
            <div className="absolute top-6 left-0 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-[9999] min-w-[160px]">

              {menu === "File" && (
                <>
                  <div onClick={()=>{newFile(); setActiveMenu(null)}} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">New File</div>
                  <div onClick={()=>{openFile(); setActiveMenu(null)}} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Open File</div>
                  <div onClick={()=>{saveFile(); setActiveMenu(null)}} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Save</div>
                  <div onClick={()=>{saveAsFile(); setActiveMenu(null)}} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Save As</div>
                   <div onClick={()=>{setShowPreferences(true); setActiveMenu(null)}} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Preferences</div>
                </>
              )}

              {menu === "Edit" && (
                <>
                  <div onClick={() => { undo(); setActiveMenu(null); }} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Undo</div>
                  <div onClick={() => { redo(); setActiveMenu(null); }} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Redo</div>
                  <div onClick={() => { runCommand("actions.find"); setActiveMenu(null); }} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Find</div>
                </>
              )}

              {menu === "Selection" && (
                <div onClick={() => { runCommand("editor.action.selectAll"); setActiveMenu(null); }} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">
                  Select All
                </div>
              )}

            </div>
          )}
        </div>
      ))}
    </div>
  );
}