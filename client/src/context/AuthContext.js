import {createContext, useReducer, useEffect} from "react"; 
import AuthReducer from "./AuthReducer";
import { useState } from "react";

export const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    errror: false
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const [currentChat, setCurrentChat] = useState(null);

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user))
      },[state.user]);
 
    return(
        <AuthContext.Provider
        value={{
            user: state.user,
            isFetching: state.isFetching,
            errror: state.errror,
            dispatch,
            currentChat: currentChat,
            setCurrentChat: setCurrentChat
        }}
        >
           {children}
        </AuthContext.Provider>
    )
} 