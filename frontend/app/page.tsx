"use client";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import BeforeAfter from "@/components/beforeAfter";
import LiveCollaboration from "@/components/liveCollaboration";
import Footer from "@/components/footer";
export default function Home(){
  
  return(
    <div className="bg-black min-h-screen text-white">
      <Navbar/>
      <Header/>
      <BeforeAfter/>
      <LiveCollaboration/>
      <Footer/>
    </div>
  )
}
