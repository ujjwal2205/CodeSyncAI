
import { useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import axios from "axios";
import {toast} from "react-toastify";
export default function ControlsBar({
  language,
  setLanguage,
  theme,
  setTheme,
  setCode,
  roomId
}: any) {
  
  const {url}=useStore();
  
  const changeLanguage=async(e:React.ChangeEvent<HTMLSelectElement>)=>{
    try {
      const language=e.target.value;
      const response=await axios.post(url+"/api/room/language-change",{roomId,language},{withCredentials:true});
      if(response.data.success){
        setLanguage(language);
        setCode("// Start coding...");
      }
      else{
        toast.error(response.data.message);
      }
    } catch (error:any) {
      console.log(error);
      toast.error(error.message);
    }
  }
  return (
    <div className="flex items-center justify-between px-5 py-2 bg-[#111]/70 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs uppercase tracking-wide">
          Language
        </span>

        <select
          value={language}
          onChange={(e) => {changeLanguage(e)}}
          className="bg-[#1e1e1e] text-white px-3 py-1.5 rounded-md text-sm border border-gray-700 hover:border-gray-500 transition outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>

     
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs uppercase tracking-wide">
          Theme
        </span>

        <select
          value={theme}
          onChange={(e) => {setTheme(e.target.value);localStorage.setItem("theme",e.target.value)}}
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