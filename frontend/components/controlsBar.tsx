import { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

export default function ControlsBar({
  language,
  setLanguage,
  theme,
  setTheme,
  setCode
}: any) {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;

    const loadTheme = async (themeName: string) => {
      try {
        const res = await fetch(
          `https://unpkg.com/monaco-themes@0.4.4/themes/${themeName}.json`
        );
        const data = await res.json();
        monaco.editor.defineTheme(themeName, data);
      } catch {
        console.log("Theme load failed:", themeName);
      }
    };

    loadTheme("monokai");
    loadTheme("Dracula");
    loadTheme("Solarized-dark");
    loadTheme("Solarized-light");
  }, [monaco]);

  return (
    <div className="flex items-center justify-between px-5 py-2 bg-[#111]/70 backdrop-blur-md border-b border-gray-800">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs uppercase tracking-wide">
          Language
        </span>

        <select
          value={language}
          onChange={(e) => {setLanguage(e.target.value);setCode("// Start coding...")}}
          className="bg-[#1e1e1e] text-white px-3 py-1.5 rounded-md text-sm border border-gray-700 hover:border-gray-500 transition outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs uppercase tracking-wide">
          Theme
        </span>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-[#1e1e1e] text-white px-3 py-1.5 rounded-md text-sm border border-gray-700 hover:border-gray-500 transition outline-none"
        >
          <option value="vs">Light</option>
          <option value="vs-dark">Dark</option>
          <option value="hc-black">High Contrast</option>
          <option value="monokai">Monokai</option>
          <option value="Dracula">Dracula</option>
          <option value="Solarized-dark">Solarized Dark</option>
          <option value="Solarized-light">Solarized Light</option>
        </select>
      </div>

    </div>
  );
}