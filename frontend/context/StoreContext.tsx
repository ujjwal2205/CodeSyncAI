"use client";
import {createContext,useContext,useEffect,useState} from "react";
import axios from "axios";
type StoreContextType={
    isLoggedIn:boolean,
    setIsLoggedIn:(value:boolean)=>void,
    openLogin:boolean,
    setOpenLogin:(value:boolean)=>void,
    openSignup:boolean,
    setOpenSignup:(value:boolean)=>void,
    url:string,
    userDetails:{userName:string,email:string},
    openForgotPassword:boolean,
    setOpenForgotPassword:(value:boolean)=>void,
};
const StoreContext=createContext<StoreContextType|null>(null);
export function StoreProvider({children}:{children:React.ReactNode}){
    const url="http://localhost:4000";
    const [userDetails,setUserDetails]=useState<{userName:string,email:string,userId:string}>({
        userName:"",
        email:"",
        userId:""
    });
    const [isLoggedIn,setIsLoggedIn]=useState<boolean>(false);
    const [openLogin,setOpenLogin]=useState<boolean>(false);
    const [openSignup,setOpenSignup]=useState<boolean>(false);
    const [openForgotPassword,setOpenForgotPassword]=useState<boolean>(false);
    useEffect(()=>{
        const fetchUserDetails=async()=>{
            try {
                const response:any=await axios.get(`${url}/api/user/details`,{withCredentials:true});
                if(response.data.success){
                    setIsLoggedIn(true);
                    setUserDetails({
                        userName:response.data.userName,
                        email:response.data.email,
                        userId:response.data.userId
                    });
                }
                else{
                    setIsLoggedIn(false);
                }
            } catch (error:any) {
                if(error.response?.status==401){
                setIsLoggedIn(false);
                setUserDetails({
                    userName:"",
                    email:"",
                    userId:""
                }); 
                }
                else{
                console.error("Error fetching user details:", error);
                }
            }
        };
        fetchUserDetails();
    }, []);
    return(
        <StoreContext.Provider value={{isLoggedIn,setIsLoggedIn,openLogin,setOpenLogin,openSignup,setOpenSignup,url,userDetails,openForgotPassword,setOpenForgotPassword}}>
            {children}
        </StoreContext.Provider>
    )
}
export function useStore(){
    const context=useContext(StoreContext);
    if(!context){
        throw new Error("context not found!");
    }
    return context
}