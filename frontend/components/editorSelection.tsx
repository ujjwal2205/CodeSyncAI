"use client";
import { useRef } from "react";
import Editor from "@monaco-editor/react";
import { useStore } from "@/context/StoreContext";
export default function EditorSection({
  language,
  theme,
  code,
  setCode,
  onMount,
  roomId,
  typingUser,
  editorLocked
}: any) {
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const {socket,userDetails}=useStore();
  return (<>
    <div className="h-full w-full bg-[#0d0d0d] rounded-xl overflow-hidden border border-gray-800 shadow-md">
      {
    typingUser && (
     <div className="text-sm text-gray-400">
        {typingUser} is typing...
     </div>
    )
    }
      <Editor
        options={{
          readOnly:editorLocked,
        }}
        height="100%"
        language={language}
        theme={theme}
        value={code}
        onChange={(val) => {
          if(editorLocked){
        return;
    }

    const newCode = val || "";

    setCode(newCode);

    socket.emit("typing", {
      roomId,
      userName: userDetails.userName
    });
    socket.emit("codeChange", {
      roomId,
      code: newCode,
    });

    if(typingTimeout.current){
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current=setTimeout(()=>{
      socket.emit("stopTyping",{
        roomId,
        userName:userDetails.userName
      });

    },1000);

  }}
        onMount={onMount}
      />
    </div>
 </>
  );
}