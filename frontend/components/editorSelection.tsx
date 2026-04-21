"use client";

import Editor from "@monaco-editor/react";

export default function EditorSection({
  language,
  theme,
  code,
  setCode,
  onMount,
}: any) {
  return (
    <div className="h-full w-full bg-[#0d0d0d] rounded-xl overflow-hidden border border-gray-800 shadow-md">
      <Editor
        height="100%"
        language={language}
        theme={theme}
        value={code}
        onChange={(val) => setCode(val || "")}
        onMount={onMount}
        
      />
    </div>
  );
}