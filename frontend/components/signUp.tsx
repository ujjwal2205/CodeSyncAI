"use client";

import { X, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {toast} from "react-toastify";
import axios from "axios";
function Signup() {
  const { setOpenSignup,setOpenLogin,url,setIsLoggedIn} = useStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData,setFormData]=useState<{userName:string,email:string,password:string,confirmPassword:string}>({userName:"",email:"",password:"",confirmPassword:""});
  const handleError = () => {
    alert("Google Sign Up was unsuccessful. Try again later.");
  };
  const handleSuccess=async(CredentialResponse:any)=>{
      const token=CredentialResponse.credential as any;
    try {
      const response=await axios.post(url+"/api/user/googleLogin",{idToken:token},{withCredentials:true});
      if(response.data.success){
        setIsLoggedIn(true);
        toast.success("Signed up successfully!");
      }
      else{
        toast.error(response.data.message);
      }
      setOpenSignup(false);
    } catch (error) {
      toast.error("Failed to sign up.");
    }
  }
  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
      }
      const handleSubmit=async(e:React.SubmitEvent<HTMLFormElement>)=>{
      e.preventDefault();
      try {
        const response=await axios.post(url+"/api/user/signup",formData,{withCredentials:true});
      if(response.data.success){
        setIsLoggedIn(true);
        toast.success("Signed up successfully!");
      }
      else{
        toast.error(response.data.message);
      }
      setOpenSignup(false);
      } catch (error) {
        toast.error("Failed to sign up.");
      }
      }
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-neutral-800/60 bg-neutral-950/85 backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">

      <div className="absolute top-[-80px] left-[-80px] h-64 w-64 rounded-full bg-neutral-100/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] h-64 w-64 rounded-full bg-[#f5f5dc]/10 blur-[100px] pointer-events-none" />

      <button
        onClick={() => setOpenSignup(false)}
        className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/40 text-neutral-400 backdrop-blur-md transition-all duration-200 hover:border-neutral-600 hover:text-neutral-100 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <X size={16} />
      </button>

      <div className="relative z-10 p-8 sm:p-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-100">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="group space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 group-focus-within:text-[#f5f5dc]">
              Username
            </label>

            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#f5f5dc]" />
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                placeholder="john_doe"
                className="w-full rounded-xl border border-neutral-800/80 bg-neutral-900/30 pl-11 pr-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none transition focus:border-[#f5f5dc]/60 focus:bg-black/40 focus:ring-4 focus:ring-[#f5f5dc]/5"
              />
            </div>
          </div>

          <div className="group space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 group-focus-within:text-[#f5f5dc]">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#f5f5dc]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="w-full rounded-xl border border-neutral-800/80 bg-neutral-900/30 pl-11 pr-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none transition focus:border-[#f5f5dc]/60 focus:bg-black/40 focus:ring-4 focus:ring-[#f5f5dc]/5"
              />
            </div>
          </div>

          <div className="group space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 group-focus-within:text-[#f5f5dc]">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#f5f5dc]" />

              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-800/80 bg-neutral-900/30 pl-11 pr-12 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none transition focus:border-[#f5f5dc]/60 focus:bg-black/40 focus:ring-4 focus:ring-[#f5f5dc]/5"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#f5f5dc] cursor-pointer"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="group space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 group-focus-within:text-[#f5f5dc] ">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#f5f5dc]" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-800/80 bg-neutral-900/30 pl-11 pr-12 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none transition focus:border-[#f5f5dc]/60 focus:bg-black/40 focus:ring-4 focus:ring-[#f5f5dc]/5"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#f5f5dc] cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#f5f5dc] py-3 text-sm font-semibold text-neutral-950 transition hover:bg-[#efefd0] active:scale-[0.98] cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800/60" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-neutral-950 px-3 text-neutral-500">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />

        <p className="mt-8 text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <button className="text-[#f5f5dc] hover:text-white cursor-pointer" onClick={()=>{setOpenLogin(true),setOpenSignup(false)}}>
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Signup;