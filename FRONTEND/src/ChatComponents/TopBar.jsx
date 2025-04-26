import React, { useEffect } from 'react'
import { useState } from 'react';
import { ChatState } from '../Context/ChatContext';
import ToolTip from '../SubComponents/ToolTip';
import NotificationIcon from '../SubComponents/Notifications';
import Avatar from '../SubComponents/Avatar';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserBox from '../SubComponents/UserBox';
import { motion } from "framer-motion";
function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {user,localchats,setlocalchats,notification,setnotifications,setactivechat} = ChatState();
  const [searchuser,setsearchuser] = useState("")
  const [resultsearchchats,setresultsearchchats] = useState([])
  const [notificationsopen,setnotificationsopen] = useState(false)
  const HandleSearchResults = async () => {
    const Token = user.data.token;
    if (!Token) {
      toast.error("No authentication token found.");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${Token}`
      }
    };
    try {
      if(searchuser.length!==0){
        const {data}  = await axios.get(`http://localhost:3001/ChatTogether/user?search=${searchuser}`, config);
        setresultsearchchats(data);
        console.log(resultsearchchats)
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users. Please try again.");
    }
  };
  console.log("notification"+notification)
  console.log(notification)
  useEffect(()=>{
    const delay = setTimeout(()=>{
      HandleSearchResults()
    },400)
    return () => clearTimeout(delay);
  },[searchuser])

  const HandleClose = () =>{
     setIsSearchOpen(false)
     setsearchuser("")
     setresultsearchchats([])
  }

  const HandleOpenNotification = async (data) => {
    setactivechat(data.chat);
    setnotificationsopen(!notificationsopen);
    setnotifications((prev) => prev.filter((d) => d._id !== data._id));
  };


  const HandleCreateChat = async(userId,username) =>{
    const Token = user.data.token;
    if (!Token) {
      toast.error("No authentication token found.");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${Token}`
      }
    };
    try{
      const {data} = await axios.post('http://localhost:3001/ChatTogether/chat/',{userId},config)
      if(!localchats.find((chat)=> chat._id === data._id)) setlocalchats([data,...localchats]);
      setactivechat(data)
      toast.success(`chat with ${username} created succesfull`)
      HandleClose()
    }catch(error){
      toast.error(`error Creating Chat with ${username}`)
      toast.error(`Try Again`)
      console.log(error)
    }
  }
  return (
    <div className="relative w-full py-2.5 bg-[#10172a] text-white rounded-xl mt-1 ">
      <div className="flex justify-between items-center px-3">
        <div className="flex-1">
          <div className="relative group w-fit">
            <ToolTip name="Search Users to Chat" className="top-full mt-3"/>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex flex-row bg-gray-700 pr-6 pl-3 py-1 rounded hover:bg-gray-600"
            >
            <i className="fa-solid fa-magnifying-glass w-6 h-6 pt-1 cursor-pointer" ></i>
            <input className="hidden md:block cursor-pointer focus:outline-none px-4 rounded-md"placeholder='Search'></input>
          </button>
          </div>
        </div>
        <div className=" font-bold sm:text-sm md:text-lg lg:text-xl">Chat-Together</div>
       <div className="flex-1 flex justify-end gap-4 sm:gap-3 md:gap-6 lg:gap-8 items-center">
        <div className="relative group w-fit cursor-pointer">
          <div className='relative inline-block text-left' onClick={()=>setnotificationsopen(!notificationsopen)}>
            <NotificationIcon
              count={notification.length}
              className="text-xl sm:text-lg md:text-xl lg:text-2xl"
            />
          </div>

          {notificationsopen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            >
              <div className="p-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2 flex justify-center">
                  Notifications
                </h4>
                {notification.length === 0 ? <div className='text-black'>No Notifications</div>
                :
                <>
                  <ul className="space-y-2">
                    {notification.map((n)=>{
                      return(
                        <li className="text-sm text-gray-600" key={n._id}>
                          {n.chat.isGroupChat===true?
                          <><div className='text-black p-2 bg-amber-500 rounded-lg flex justify-center' onClick={()=>HandleOpenNotification(n)}>new message in new message in {n.chat.chatName}</div></>:
                          <><div className='text-black p-2 bg-amber-500 rounded-lg flex justify-center' onClick={()=>HandleOpenNotification(n)}>new message from {n.sender.username}</div></>}
                        </li>
                      )
                    })}
                  </ul>
                </>
                }
              </div>
            </motion.div>
          )}
        </div>
        <div>
          <Avatar
            className="w-8 h-8 sm:w-6 sm:h-6 md:w-9 md:h-9 lg:w-10 lg:h-10 cursor-pointer"
            user = {user.data}
          />  
          </div>
      </div>
      {isSearchOpen && (<>
        <div className="fixed top-0 left-0 h-full xl:w-100 md:w-100 sm:w-70 bg-[#10172a] shadow-lg p-6 z-50 transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="lg:text-2xl md:text-xl sm:text-lg font-bold text-white">Search Chats</h2>
            <button
              onClick={HandleClose}
              className="text-white font-bold rounded-lg w-10 h-10 border-2  cursor-pointer px-3 py-2"
            >
              ✕
            </button>
          </div>
          <div className='flex flex-row border-2 border-gray-400 rounded-lg'>
            <input
              type="text"
              placeholder="Type to search..."
              className="w-full px-3 py-2 rounded-sm focus:outline-none"
              onChange={(e)=>setsearchuser(e.target.value)}
              />
              <button type="submit" onClick={()=>{
                if (searchuser.trim().length === 0) {
                  toast.error("Please Enter the User name");
                } else {
                  HandleSearchResults(); 
                }}}
                className="text-white px-4 border-2 border-gray-600 rounded-lg cursor-pointer focus:bg-gray-800">Go
              </button>
          </div>
            <div className='mt-5 mx-2 max-h-[600px] overflow-y-auto scrollbar-none' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {resultsearchchats.length === 0 ? (
                  <h2 className='text-center mt-4'>No User Found</h2>
                  ) : (
                  <ul>
                    {resultsearchchats.map((data) => (
                      <li key={data._id}>
                        <UserBox 
                          onClick={()=>HandleCreateChat(data._id,data.username)}
                          userdata={data}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
          </div>
      </>
      )}
    </div>
    </div>
  );
}

export default TopBar;







