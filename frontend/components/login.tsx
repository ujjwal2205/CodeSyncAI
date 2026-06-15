"use client";

import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {toast} from "react-toastify";
import axios from "axios";
function Login() {
  const { setOpenLogin,setOpenSignup,url,setIsLoggedIn,openForgotPassword,setOpenForgotPassword,openLogin} = useStore();
  const [showPassword, setShowPassword] =useState<boolean>(false);
  const [forgotShowPassword,setForgotShowPassword]=useState<boolean>(false);
  const [otp,setOtp]=useState<string>("");
  const [newPassword,setNewPassword]=useState<string>("");
  const [formData,setFormData]=useState<{email:string,password:string}>({email:"",password:""});
    const handleSuccess=async(CredentialResponse:any)=>{
      const token=CredentialResponse.credential as any;
    try {
      const response=await axios.post(url+"/api/user/googleLogin",{idToken:token},{withCredentials:true});
      if(response.data.success){
        setIsLoggedIn(true);
        toast.success("Logged in successfully!");
      }
      else{
        toast.error(response.data.message);
      }
      setOpenLogin(false);
    } catch (error) {
      toast.error("Failed to log in.");
    }
  }
    const handleError = () => {
        alert("Google Sign In was unsuccessful. Try again later.");
      };
      const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
      }
      const handleForgotPassword=async (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        try{
        if(!formData.email){
          toast.error("Enter your email first");
          return;
        }
        const response=await axios.post(url+"/api/forgot-password/otp",{email:formData.email},{withCredentials:true});
        if(response.data.success){
          setOpenLogin(false);
          setOpenForgotPassword(true);
          toast.success(`OTP sent to ${formData.email}`);
        }
        else{
           toast.error(response.data.message);
        }
        }
        catch(error:any){
          toast.error("Something went wrong. Try again later.");
        }
        
      }
      const handleSubmit=async(e:React.SubmitEvent<HTMLFormElement>)=>{
      e.preventDefault();
      try {
        const response=await axios.post(url+"/api/user/login",formData,{withCredentials:true});
      if(response.data.success){
        setIsLoggedIn(true);
        toast.success("Logged in successfully!");
      }
      else{
        toast.error(response.data.message);
      }
      setOpenLogin(false);
      } catch (error) {
        toast.error("Failed to log in.");
      }}
      const handleForgotPasswordSubmit=async(e:React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
          if(!otp || !newPassword){
           toast.error("Please fill all the fields.");
           return;
          }
          const response= await axios.post(url+"/api/forgot-password/verification",{email:formData.email,otp,newPassword});
          if(response.data.success){
            toast.success(response.data.message);
            setOpenForgotPassword(false);
          }
          else{
            toast.error(response.data.message);
            setOtp("");
            setNewPassword("");
          }
        }
        catch(error:any){
          console.log(error);
          toast.error(error.message);
        }

      }
  return (
    <>
    {openLogin ?
    <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-neutral-800/60 bg-neutral-950/85 backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">

      <div className="absolute top-[-80px] left-[-80px] h-64 w-64 rounded-full bg-neutral-100/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] h-64 w-64 rounded-full bg-[#f5f5dc]/10 blur-[100px] pointer-events-none" />

      <button
        onClick={() => setOpenLogin(false)}
        className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/40 text-neutral-400 backdrop-blur-md transition-all duration-200 hover:border-neutral-600 hover:text-neutral-100 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <X size={16} />
      </button>

      <div className="relative z-10 p-8 sm:p-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-100">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="group space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 group-focus-within:text-[#f5f5dc]">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#f5f5dc]" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-800/80 bg-neutral-900/30 pl-11 pr-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none transition focus:border-[#f5f5dc]/60 focus:bg-black/40 focus:ring-4 focus:ring-[#f5f5dc]/5"
              />
            </div>
          </div>

          <div className="group space-y-2">

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 group-focus-within:text-[#f5f5dc]">
                Password
              </label>

              <button
                type="button"
                className="text-xs text-neutral-500 hover:text-[#f5f5dc] cursor-pointer"
                onClick={handleForgotPassword}
              >
                Forgot?
              </button>
            </div>

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

          <button
            type="submit"
            className="w-full rounded-xl bg-[#f5f5dc] py-3 text-sm font-semibold text-neutral-950 transition hover:bg-[#efefd0] active:scale-[0.98] cursor-pointer"
          >
            Sign In
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
          Don't have an account?{" "}
          <button className="text-[#f5f5dc] hover:text-white cursor-pointer" onClick={()=>{setOpenSignup(true), setOpenLogin(false)}}>
            Create Account
          </button>
        </p>

      </div>
    </div>
    : (
<div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-neutral-800/60 bg-neutral-950/85 backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">

  <div className="absolute top-[-80px] left-[-80px] h-64 w-64 rounded-full bg-neutral-100/5 blur-[80px] pointer-events-none" />
  <div className="absolute bottom-[-100px] right-[-100px] h-64 w-64 rounded-full bg-[#f5f5dc]/10 blur-[100px] pointer-events-none" />

  <button
    onClick={() => {
      setOpenForgotPassword(false);
      setOpenLogin(true);
    }}
    className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/40 text-neutral-400 backdrop-blur-md transition-all duration-200 hover:border-neutral-600 hover:text-neutral-100 hover:scale-105 active:scale-95 cursor-pointer"
  >
    <X size={16} />
  </button>

  <div className="relative z-10 p-8 sm:p-10">

    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight text-neutral-100">
        Reset Password
      </h2>
      <p className="mt-2 text-sm text-neutral-400">
        Enter OTP and create a new password
      </p>
    </div>

    <form
      onSubmit={handleForgotPasswordSubmit}
      className="space-y-5"
    >

      <div className="group space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
          OTP
        </label>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="w-full rounded-xl border border-neutral-800/80 bg-neutral-900/30 pl-11 pr-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none transition focus:border-[#f5f5dc]/60 focus:bg-black/40 focus:ring-4 focus:ring-[#f5f5dc]/5"
          />
        </div>
      </div>

      <div className="group space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
          New Password
        </label>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

          <input
            type={forgotShowPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full rounded-xl border border-neutral-800/80 bg-neutral-900/30 pl-11 pr-12 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none transition focus:border-[#f5f5dc]/60 focus:bg-black/40 focus:ring-4 focus:ring-[#f5f5dc]/5"
          />

          <button
            type="button"
            onClick={() =>
              setForgotShowPassword(!forgotShowPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#f5f5dc] cursor-pointer"
          >
            {forgotShowPassword ? (
              <EyeOff size={17} />
            ) : (
              <Eye size={17} />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-[#f5f5dc] py-3 text-sm font-semibold text-neutral-950 transition hover:bg-[#efefd0] active:scale-[0.98] cursor-pointer"
      >
        Reset Password
      </button>

      <button
        type="button"
        onClick={() => {
          setOpenForgotPassword(false);
          setOpenLogin(true);
        }}
        className="w-full text-sm text-neutral-400 hover:text-[#f5f5dc] transition cursor-pointer"
      >
        Back to Login
      </button>

    </form>
  </div>
</div>
)}
    </>
  );
}

export default Login;