"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LiveCollaboration() {
  const [lines, setLines] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const code = [
    "function calculateImpact(stars, contributors) {",
    "  const score = (stars * 0.4) + (contributors * 0.6);",
    "  return `Project Impact: ${score}%`;",
    "}",
    "",
    "// Rahul joined the session...",
    "console.log(calculateImpact(1200, 45));",
  ];

  // Human-like typing (random speed)
  useEffect(() => {
    if (index < code.length) {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, code[index]]);
        setIndex((prev) => prev + 1);
      }, 200 + Math.random() * 300); // random typing speed

      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <section className="w-full py-32 px-6 bg-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Heading */}
        <h2 className="text-5xl font-bold text-center mb-16">
          Code Together. <span className="text-neutral-500">Instantly.</span>
        </h2>

        {/* Editor */}
        <div className="relative bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)]">

          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
            <span className="text-xs text-neutral-500 font-mono">
              live-session.ts
            </span>

            {/* Live Activity Feed */}
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="text-green-400 animate-pulse">● Live</span>
              <span>Rahul joined</span>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex font-mono text-sm">

            {/* Line Numbers */}
            <div className="bg-neutral-900 px-4 py-6 text-neutral-600">
              {code.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Content */}
            <div className="relative flex-1 px-4 py-6">

              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`whitespace-pre ${
                    i === lines.length - 1 ? "bg-white/5" : ""
                  }`}
                >
                  {line}
                </motion.div>
              ))}

              {/* Blinking Cursor */}
              <span className="inline-block w-[2px] h-5 bg-indigo-400 animate-pulse ml-1" />

              {/* AI Autocomplete */}
              {index > 4 && (
                <div className="text-neutral-600 italic mt-1">
                  → AI: Suggest using useMemo() for optimization
                </div>
              )}
            </div>
          </div>

          {/* Floating Cursor with Trail */}
          <Cursor name="You" color="#22c55e" x={150} y={150} />
          <Cursor name="Rahul" color="#3b82f6" x={300} y={220} />
          <Cursor name="AI" color="#a855f7" x={220} y={280} />

          {/* Join Animation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: [0, 1, 0], y: [0, 10, 20] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-12 right-6 text-xs text-green-400"
          >
            Rahul joined
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function Cursor({ name, color, x, y }: any) {
  return (
    <motion.div
      className="absolute pointer-events-none flex flex-col items-start"
      animate={{
        x: [x, x + 25, x],
        y: [y, y - 15, y],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Cursor */}
      <div style={{ width: 2, height: 20, background: color }} />

      {/* Label */}
      <span
        className="text-[10px] px-2 py-0.5 rounded mt-1 text-white shadow-lg"
        style={{ background: color }}
      >
        {name}
      </span>

      {/* Glow */}
      <div
        className="absolute blur-xl opacity-40"
        style={{
          width: 20,
          height: 20,
          background: color,
        }}
      />
    </motion.div>
  );
}