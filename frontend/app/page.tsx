"use client";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { useStore } from "@/context/StoreContext";
import BeforeAfter from "@/components/beforeAfter";
import LiveCollaboration from "@/components/liveCollaboration";
import Footer from "@/components/footer";
import Login from "@/components/login";
import Signup from "@/components/signUp";

export default function Home(){
  const {openLogin,openSignup,openForgotPassword} = useStore();
  return(
    <div className="bg-black min-h-screen text-white">
      
      {(openLogin || openForgotPassword) && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <Login />
    </div>
      )}
      {openSignup && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <Signup />
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
