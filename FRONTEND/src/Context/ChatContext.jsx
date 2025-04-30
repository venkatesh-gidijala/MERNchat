import { createContext, useContext, useState,useEffect } from "react";
import { useNavigate,useLocation } from 'react-router-dom'

const Chatcontext = createContext();

const ChatProvider = ({children}) =>{
    const location = useLocation();
    const [user,setuser] = useState();
    const navigate = useNavigate();
    const [localchats,setlocalchats] = useState([])
    const [activechat,setactivechat] = useState("")
    const [notification,setnotifications] = useState([])
    const [fetchTrigger, setFetchTrigger] = useState(false);


    const allowedPathsForGuests = ["/", "/login"];
    useEffect(()=>{
        const UserInfo = JSON.parse(localStorage.getItem("userInfo"))
        setuser(UserInfo)
        if(!UserInfo && !allowedPathsForGuests.includes(location.pathname)){
            navigate("/login")
        }
        if (UserInfo && location.pathname === "/") {
            navigate("/HomePage");
        }
    },[navigate,location.pathname])



    return(
    <Chatcontext.Provider value={{user,setuser,activechat,setactivechat,localchats,setlocalchats,notification,setnotifications,fetchTrigger, setFetchTrigger}}>
        {children}
    </Chatcontext.Provider>
    )
}
export const ChatState = () =>{
    return useContext(Chatcontext);
}

export default ChatProvider;