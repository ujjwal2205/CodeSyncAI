"use client";
import {createContext,useContext,useState} from "react";
type StoreContextType={
    isLoggedIn:boolean,
    setIsLoggedIn:(value:boolean)=>void,
    openLogin:boolean,
    setOpenLogin:(value:boolean)=>void;
};
const StoreContext=createContext<StoreContextType|null>(null);
export function StoreProvider({children}:{children:React.ReactNode}){
    const [isLoggedIn,setIsLoggedIn]=useState(false);
    const [openLogin,setOpenLogin]=useState(false);
    return(
        <StoreContext.Provider value={{isLoggedIn,setIsLoggedIn,openLogin,setOpenLogin}}>
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