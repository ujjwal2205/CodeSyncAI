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
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState<string>("javascript");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [code, setCode] = useState<string>("// Start coding...");
  const [showChat, setShowChat] = useState<boolean>(true);
  const [customInput, setCustomInput] = useState<string>("");
  const [preferences, setPreferences] = useState({
  fontSize: 14,
  minimap: false,
  tabSize: 2,
  wordWrap: true,
});
const [showPreferences, setShowPreferences] = useState(false);
  const [leftWidth, setLeftWidth] = useState<number>(50);
  const [rightWidth, setRightWidth] = useState<number>(25);
  const [isLoaded,setIsLoaded]=useState(false);
  const [output,setOutput]=useState("");
  const applySettings = (editor: any, prefs: any) => {
  editor.updateOptions({
    fontSize: prefs.fontSize,
    minimap: {
      enabled: prefs.minimap,
      scale: 20,
      maxColumn: 200,
      renderCharacters: true,
    },
    wordWrap: prefs.wordWrap ? "on" : "off",
    tabSize: prefs.tabSize,
  });
};
  const languageMap:any={
    javascript:63,
    python:71,
    java:62,
    cpp:54
  };
  const runCode = async () => {
    if(isRunning) return;
    setIsRunning(true);
    setOutput("Running...");
  try {
    const encodeBase64 = (str: string) => {
  return btoa(
    String.fromCharCode(...new TextEncoder().encode(str))
  );
};
     const decodeBase64 = (str: string | null) => {
  if (!str) return "";

  const bytes = Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

    const encodedCode = encodeBase64(code);

    const response = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=true&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: encodedCode,
          language_id: languageMap[language],
          stdin: encodeBase64(customInput),
        }),
      }
    );

    if (!response.ok) {
      setOutput("API Error: " + response.status);
      return;
    }

    const data = await response.json();
    const stdout = decodeBase64(data.stdout);
    const stderr = decodeBase64(data.stderr);
    const compileOutput = decodeBase64(data.compile_output);

   

    setOutput(compileOutput || stderr || stdout || "No output");
  } catch (error: any) {
    console.error(error);
    setOutput("Something went wrong while running code");
  }finally{
    setIsRunning(false);
  }
};
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    applySettings(editor, preferences);
  };
  useEffect(() => {
  if (!editorRef.current) return;
  if(!isLoaded) return;
  applySettings(editorRef.current,preferences);
  localStorage.setItem("preferences",JSON.stringify(preferences));
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
      const pref=localStorage.getItem("preferences");
      if(saved){
       const parsed=JSON.parse(saved);
       setLeftWidth(parsed.leftWidth??50);
       setRightWidth(parsed.rightWidth??25);
       setShowChat(parsed.showChat??false);
      }
      if(pref){
        const parsedPref=JSON.parse(pref);
        setPreferences({
          fontSize: parsedPref.fontSize??14,
          minimap: parsedPref.minimap??false,
          tabSize: parsedPref.tabSize??2,
          wordWrap: parsedPref.wordWrap??true,
        })
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="w-[450px] bg-[#1e1e1e] rounded-2xl shadow-2xl p-6 text-white border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold tracking-wide flex items-center gap-2">
          ⚙️ Preferences
        </h2>
        
      </div>

      <div className="flex justify-between items-center mb-5">
        <span className="text-gray-300">Font Size</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setPreferences((p) => ({
                ...p,
                fontSize: Math.max(10, p.fontSize - 1),
              }))
            }
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            −
          </button>

          <span className="w-8 text-center font-medium text-lg">
            {preferences.fontSize}
          </span>

          <button
            onClick={() =>
              setPreferences((p) => ({
                ...p,
                fontSize: p.fontSize + 1,
              }))
            }
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-5">
        <span className="text-gray-300">Tab Size</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setPreferences((p) => ({
                ...p,
                tabSize: Math.max(1, p.tabSize - 1),
              }))
            }
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            −
          </button>

          <span className="w-8 text-center font-medium text-lg">
            {preferences.tabSize}
          </span>

          <button
            onClick={() =>
              setPreferences((p) => ({
                ...p,
                tabSize: p.tabSize + 1,
              }))
            }
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-5">
        <span className="text-gray-300">Minimap</span>
        <button
          onClick={() =>
            setPreferences((p) => ({
              ...p,
              minimap: !p.minimap,
            }))
          }
          className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
            preferences.minimap ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
              preferences.minimap ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-300">Word Wrap</span>
        <button
          onClick={() =>
            setPreferences((p) => ({
              ...p,
              wordWrap: !p.wordWrap,
            }))
          }
          className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
            preferences.wordWrap ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
              preferences.wordWrap ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <button
        onClick={() => setShowPreferences(false)}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-xl font-medium transition"
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
        runCode={runCode}
        isRunning={isRunning}
      />

      <ControlsBar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        setCode={setCode}
      />

      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden"
      >

        <div
          style={{ width: `${leftWidth}%` }}
        > 
        {isLoaded &&(
          <EditorSection
            language={language}
            theme={theme}
            code={code}
            setCode={setCode}
            onMount={handleEditorDidMount}
          />)}
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
          <RightPanel output={output} customInput={customInput} setCustomInput={setCustomInput} />
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