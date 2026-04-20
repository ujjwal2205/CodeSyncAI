"use client";

import { useState } from "react";

export default function MenuBar({ newFile, saveFile, runCommand, openFile,saveAsFile,setShowPreferences }: any) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
                  <div onClick={() => { runCommand("undo"); setActiveMenu(null); }} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Undo</div>
                  <div onClick={() => { runCommand("redo"); setActiveMenu(null); }} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Redo</div>
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