import { useStore } from "@/context/StoreContext";
export default function RightPanel({ output, customInput, setCustomInput, roomId }: any) {
  const {socket}=useStore();
  return (
    <div className="h-full w-full border-l border-gray-800 flex flex-col bg-[#0b0b0b]">

      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-wider text-gray-400">
          Console
        </h2>
      </div>

      <div className="p-3 border-b border-gray-800">
        <h3 className="text-xs text-gray-400 mb-2">Custom Input</h3>
        <textarea
          value={customInput}
          onChange={(e) => {
            const newInput=e.target.value;
            setCustomInput(e.target.value)
           socket.emit("customInput",{roomId,input:newInput});
          }}
          placeholder="Enter input here.."
          className="w-full h-24 bg-black text-white text-sm font-mono p-2 rounded border border-gray-900 focus:outline-none resize-none"
        />
      </div>
      <div className="flex-1 p-3">
        <h3 className="text-xs text-gray-400 mb-2">Output</h3>
        <div className="h-full bg-black rounded-lg p-3 text-green-400 text-sm font-mono overflow-auto border border-gray-900 whitespace-pre-wrap">
          <p className="text-gray-500">
            {output || "Run your code to see output..."}
          </p>
        </div>
      </div>
    </div>
  );
}