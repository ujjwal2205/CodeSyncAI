export default function RightPanel() {
  return (
    <div className="h-full w-full border-l border-gray-800 flex flex-col bg-[#0b0b0b]">

      <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-wider text-gray-400">
          Output
        </h2>
        <span className="text-xs text-gray-500">Console</span>
      </div>

      <div className="flex-1 p-3">
        <div className="h-full bg-black rounded-lg p-3 text-green-400 text-sm font-mono overflow-auto border border-gray-900">
          <p className="text-gray-500">Run your code to see output...</p>
        </div>
      </div>
    </div>
  );
}