"use client";
import { useRef, useState, useEffect } from "react";
import TopNavbar from "./topNavbar";
import ControlsBar from "./controlsBar";
import EditorSection from "./editorSelection";
import RightPanel from "./rightPanel";
import ChatPanel from "./chatPanel";

export default function EditorRoom({ roomId }: { roomId: string }) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [language, setLanguage] = useState<string>("javascript");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [code, setCode] = useState<string>("// Start coding...");
  const [showChat, setShowChat] = useState<boolean>(true);
  const [preferences, setPreferences] = useState({
  fontSize: 14,
  minimap: true,
  tabSize: 2,
  wordWrap: true,
});
const [showPreferences, setShowPreferences] = useState(false);
  const [leftWidth, setLeftWidth] = useState<number>(50);
  const [rightWidth, setRightWidth] = useState<number>(25);
  const [isLoaded,setIsLoaded]=useState(false);
  
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };
  useEffect(() => {
  if (!editorRef.current) return;

  editorRef.current.updateOptions({
    fontSize: preferences.fontSize,
    minimap: { enabled: !!preferences.minimap },
    wordWrap: preferences.wordWrap ? "on" : "off",
    tabSize: preferences.tabSize,
  });
}, [preferences]);
  const newFile = () => setCode("");

  const saveFile = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const runCommand = (cmd: string) => {
    editorRef.current?.trigger("keyboard", cmd, null);
  };

  const startResizing = (type: "left" | "right") => (e: any) => {
    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const onMouseMove = (e: MouseEvent) => {
      const offsetX = e.clientX - rect.left;
      const totalWidth = rect.width;

      if (type === "left") {
        const newLeft = (offsetX / totalWidth) * 100;

        if (newLeft > 20 && newLeft < 70) {
          setLeftWidth(newLeft);
        }
      }

      if (type === "right") {
        const newRight = ((totalWidth - offsetX) / totalWidth) * 100;

        if (newRight > 15 && newRight < 40) {
          setRightWidth(newRight);
        }
      }
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopResize);
      document.body.style.cursor = "default";
    };

    document.body.style.cursor = "col-resize";

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResize);
  };
  const openFile = () => {
    const input = document.createElement("input");
    input.type = "file";
  
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = (event: any) => {
        const content = event.target.result;
        setCode(content);
      };
  
      reader.readAsText(file);
    };
  
    input.click();
  };
  const saveAsFile = async () => {
  try {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: "code.js",
      types: [
  {
    description: "JavaScript Files",
    accept: {
      "text/javascript": [".js"],
    },
  },
  {
    description: "C++ Files",
    accept: {
      "text/x-c++src": [".cpp"],
    },
  },
  {
    description: "Java Files",
    accept: {
      "text/x-java-source": [".java"],
    },
  },
]
    });

    const writable = await handle.createWritable();
    await writable.write(code);
    await writable.close();

  } catch (err) {
    console.log("User cancelled");
  }
};
  useEffect(() => {
    if(!isLoaded) return;
    if (!showChat) {
      setRightWidth(0);
    }
    else{
      setRightWidth(25);
    }
  }, [showChat]);
  useEffect(()=>{
    if(!isLoaded) return;
    localStorage.setItem("layout",JSON.stringify({leftWidth,rightWidth,showChat}));
  },[leftWidth,rightWidth,showChat]);
  useEffect(()=>{
    try {
      const saved=localStorage.getItem("layout");
      if(saved){
       const parsed=JSON.parse(saved);
       setLeftWidth(parsed.leftWidth??50);
       setRightWidth(parsed.rightWidth??25);
       setShowChat(parsed.showChat??false);
      }
    } catch (error) {
      console.log("Invalid localStorage data");
    }finally{
      setIsLoaded(true);
    }
  },[]);
  return (
    <div className="h-screen flex flex-col bg-[#0f0f0f] text-white">
      {showPreferences && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"> 
    <div className="w-[420px] bg-[#1e1e1e] rounded-xl shadow-2xl p-6 text-white">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <button
          onClick={() => setShowPreferences(false)}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span>Font Size</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setPreferences((p) => ({
                ...p,
                fontSize: Math.max(10, p.fontSize - 1),
              }))
            }
            className="px-2 py-1 bg-gray-700 rounded"
          >
            -
          </button>

          <span>{preferences.fontSize}</span>

          <button
            onClick={() =>
              setPreferences((p) => ({
                ...p,
                fontSize: p.fontSize + 1,
              }))
            }
            className="px-2 py-1 bg-gray-700 rounded"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span>Tab Size</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setPreferences((p) => ({
                ...p,
                tabSize: Math.max(1, p.tabSize - 1),
              }))
            }
            className="px-2 py-1 bg-gray-700 rounded"
          >
            -
          </button>

          <span>{preferences.tabSize}</span>

          <button
            onClick={() =>
              setPreferences((p) => ({
                ...p,
                tabSize: p.tabSize + 1,
              }))
            }
            className="px-2 py-1 bg-gray-700 rounded"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span>Minimap</span>
        <button
          onClick={() =>
            setPreferences((p) => ({
              ...p,
              minimap: !p.minimap,
            }))
          }
          className={`px-3 py-1 rounded ${
            preferences.minimap ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          {preferences.minimap ? "ON" : "OFF"}
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span>Word Wrap</span>
        <button
          onClick={() =>
            setPreferences((p) => ({
              ...p,
              wordWrap: !p.wordWrap,
            }))
          }
          className={`px-3 py-1 rounded ${
            preferences.wordWrap ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          {preferences.wordWrap ? "ON" : "OFF"}
        </button>
      </div>

      <button
        onClick={() => setShowPreferences(false)}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
      >
        Close
      </button>

    </div>
  </div>
)}
      <TopNavbar
        roomId={roomId}
        newFile={newFile}
        saveFile={saveFile}
        runCommand={runCommand}
        showChat={showChat}
        setShowChat={setShowChat}
        setCode={setCode}
        openFile={openFile}
        saveAsFile={saveAsFile}
        preferences={preferences}
        setPreferences={setPreferences}
        showPreferences={showPreferences}
        setShowPreferences={setShowPreferences}
      />

      <ControlsBar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />

      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden"
      >

        <div
          style={{ width: `${leftWidth}%` }}
        >
          <EditorSection
            language={language}
            theme={theme}
            code={code}
            setCode={setCode}
            onMount={handleEditorDidMount}
            preferennces={preferences}
          />
        </div>

        {/*Divider 1 */}
        <div
          onMouseDown={startResizing("left")}
          className="w-[6px] cursor-col-resize flex items-center justify-center group"
        >
          <div className="w-[2px] h-full bg-gray-700 group-hover:bg-blue-500" />
        </div>

        {/*Output */}
        <div
          style={{ width: `${100 - leftWidth - rightWidth}%` }}
        >
          <RightPanel />
        </div>

        {/*Divider 2 */}
        {showChat && (
          <div
            onMouseDown={startResizing("right")}
            className="w-[6px] cursor-col-resize flex items-center justify-center group"
          >
            <div className="w-[2px] h-full bg-gray-700 group-hover:bg-purple-500" />
          </div>
        )}

        {/*Chat */}
        {showChat && (
          <div
            style={{ width: `${rightWidth}%` }}
            className="min-w-[240px] will-change-[width]"
          >
            <ChatPanel />
          </div>
        )}
      </div>
    </div>
  );
}