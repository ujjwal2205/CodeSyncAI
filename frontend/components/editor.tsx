"use client";
import Editor from "@monaco-editor/react";
export default function CodeEditor(){
    return (
        <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// Start coding..."
        theme="vs-dark"
        />
    )
}