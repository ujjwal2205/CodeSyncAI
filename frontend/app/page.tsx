"use client";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { useStore } from "@/context/StoreContext";
import BeforeAfter from "@/components/beforeAfter";
import LiveCollaboration from "@/components/liveCollaboration";
import Footer from "@/components/footer";
import Login from "@/components/login";

export default function Home(){
  const {openLogin} = useStore();
  return(
    <div className="bg-black min-h-screen text-white">
      {openLogin && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <Login />
    </div>
      )}
      <Navbar/>
      <Header/>
      <BeforeAfter/>
      <LiveCollaboration/>
      <Footer/>
    </div>
  )
}
