import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function Header() {
  const router=useRouter();
  const {isLoggedIn,setOpenLogin,url} = useStore();
  const [maxCapacityPopupOpen,setMaxCapacityPopupOpen]=useState<boolean>(false);
    const [roomIdPopupOpen,setRoomIdPopupOpen]=useState<boolean>(false);
    const [joinRoomId,setJoinRoomId]=useState<string>("");
    const [maxCapacity, setMaxCapacity] = useState<number>(1);
  const createRoom=async()=>{
    try{
      const response=await axios.post(url+"/api/room/create",{maxCapacity},{withCredentials:true});
      if(response.data.success){
        router.push(`/editor/${response.data.roomId}`);
      }
      else{
        toast.error("Failed to create room.");
      }
    }
    catch(error:any){
      console.log(error);
      toast.error(error.message);
    }
    }
    const joinRoom=async()=>{
      try{
      const response=await axios.post(url+"/api/room/join",{roomId:joinRoomId},{withCredentials:true});
      if(response.data.success){
        router.push(`/editor/${joinRoomId}`);
      }
      else{
        toast.error(response.data.message);
      }
    }
      catch(error:any){
        console.log(error);
        toast.error(error.message);
      }
    }
  return (
    <>
    <section className="relative min-h-170 w-full bg-black text-white flex items-center overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-black" />
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />

      <div className="relative w-full px-6 md:px-16 lg:px-24 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            Write Code <br />
            <span className="bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              Together. Instantly.
            </span>
          </h1>

          <p className="mt-6 text-lg text-neutral-400 max-w-xl leading-relaxed">
            A real-time code sharing workspace for practicing, debugging, and solving problems together.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {isLoggedIn ? (
              <>
                 <button className="px-7 py-3 bg-[#f5f5dc] text-black font-semibold rounded-2xl hover:scale-105 cursor-pointer hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition duration-200" onClick={()=>setMaxCapacityPopupOpen(true)}>
              Create Room
            </button>
            <button className="px-7 py-3 border border-neutral-700 rounded-2xl hover:bg-neutral-900 hover:border-neutral-500 transition duration-200 cursor-pointer" onClick={()=>setRoomIdPopupOpen(true)}>
              Join Room
            </button>
            </>
            ):(
              <>
               <button className="px-7 py-3 bg-[#f5f5dc] text-black font-semibold rounded-2xl hover:scale-105 cursor-pointer hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition duration-200" onClick={()=>setOpenLogin(true)}>
              Create Room
            </button>
            <button className="px-7 py-3 border border-neutral-700 rounded-2xl hover:bg-neutral-900 hover:border-neutral-500 transition duration-200 cursor-pointer" onClick={()=>setOpenLogin(true)}>
              Join Room
            </button>
              </>
            )}
             

          </div>
          <p className="mt-6 text-sm text-neutral-500">
            Works in browser • No installation • Instant sharing
          </p>
        </div>

        <div className="relative w-full">
          
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent blur-2xl rounded-3xl" />

          <div className="relative bg-neutral-900/80 backdrop-blur-xl rounded-2xl p-5 border border-neutral-800 shadow-[0_25px_80px_rgba(0,0,0,0.7)] ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <span className="text-xs text-neutral-500">live_session.js</span>
            </div>

            <pre className="text-sm text-neutral-300 leading-relaxed relative">
{`function multiply(a, b) {
  return a * b;
}

// Teammate editing...
console.log(multiply(4, 5));`}
              <span className="inline-block w-[2px] h-4 bg-white ml-1 animate-pulse" />
            </pre>

            <div className="mt-5 flex items-center gap-3 text-xs">
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                ● You
              </span>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                ● Teammate
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
     {maxCapacityPopupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setMaxCapacityPopupOpen(false)}
    />

    <div className="relative z-10 w-96 rounded-2xl bg-black border border-gray-900 p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <h2 className="text-xl font-semibold text-white mb-2">
        Create Room
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Select the maximum number of participants allowed in this room.
      </p>

      <input
        type="range"
        min="1"
        max="10"
        value={maxCapacity}
        onChange={(e) => setMaxCapacity(Number(e.target.value))}
        className="w-full accent-[#f5f5dc] cursor-pointer"
      />

      <div className="mt-4 flex items-center justify-between">
        <span className="text-gray-400 text-sm">
          Maximum Capacity
        </span>

        <span className="px-3 py-1 rounded-lg bg-gray-950 border border-gray-800 text-[#f5f5dc] font-semibold">
          {maxCapacity}
        </span>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={createRoom}
          className="flex-1 bg-[#f5f5dc] text-black py-2.5 rounded-lg font-medium hover:bg-[#e6e6cc] transition-all cursor-pointer"
        >
          Create Room
        </button>

        <button
          onClick={() => setMaxCapacityPopupOpen(false)}
          className="flex-1 border border-gray-800 text-gray-300 py-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{roomIdPopupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setRoomIdPopupOpen(false)}
    />

    <div className="relative z-10 w-96 rounded-2xl bg-black border border-gray-900 p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <h2 className="text-xl font-semibold text-white mb-2">
        Join Room
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Enter the room ID to join an existing room.
      </p>

      <input
        type="text"
        placeholder="Room ID"
        value={joinRoomId}
        onChange={(e) => setJoinRoomId(e.target.value)}
        className="w-full bg-gray-950 border border-gray-800 text-gray-400 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-3 mt-8">
        <button
          onClick={joinRoom}
          className="flex-1 bg-[#f5f5dc] text-black py-2.5 rounded-lg font-medium hover:bg-[#e6e6cc] transition-all cursor-pointer"
        >
          Join Room
        </button>

        <button
          onClick={() => setRoomIdPopupOpen(false)}
          className="flex-1 border border-gray-800 text-gray-300 py-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}