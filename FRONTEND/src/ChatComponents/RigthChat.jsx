import React, { useEffect, useRef, useState } from 'react';
import { ChatState } from '../Context/ChatContext';
import Setname from '../SubComponents/Setname';
import Avatar from '../SubComponents/Avatar';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserBox from '../SubComponents/UserBox';
import Strip from '../Customcomponents/strip';
import {io} from 'socket.io-client'
import { BeatLoader } from 'react-spinners';
export default function RightChat({fetch,setfetch}) {
  const [socket,setsocket] = useState(null)
  // const [selectchatcompare,setselectchatcompare] = useState(null)
  const ENDPOINT = "https://chatapp2-0-ss0n.onrender.com"
  const {user,activechat,setactivechat, setFetchTrigger} = ChatState();
  const [editmode,seteditmode] = useState(false);
  const [groupname,setgroupname] = useState(activechat.chatName);
  const [groupmembers,setgroupmembers] = useState([]);
  const [searchuser,setsearchuser] = useState("");
  const [searchresults,setsearchresults] = useState();
  const [userMessages,setuserMessages] = useState([])
  const [message,setMessage] = useState("")
  const [socketConnected,setsocketConnected] = useState(false)
  const [Typing,setTyping] = useState(false)
  const [istyping,setistyping] = useState(false)
  //socket.io 
  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setsocket(newSocket);
    if (user && user.data) {
      newSocket.emit("setup", user.data);
      newSocket.on("connect", () => {
        setsocketConnected(true);
      });
      newSocket.on("connected", () => {
        console.log("User successfully setup with socket");
      });
    }
    newSocket.on("typing",()=>{
      setistyping(true)
    })
    newSocket.on("stop typing",()=>{
      setistyping(false)
    })
    return () => {
      newSocket.disconnect();;
    };
  }, [user]);

  useEffect(() => {
  if (!socket) return;

  const HandleAddtonotification = async(newMessageRecieved) => {
  if(!newMessageRecieved) return;
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
    const { data } = await axios.post(
      `https://chatapp2-0-ss0n.onrender.com/ChatTogether/notification?chatId=${newMessageRecieved.chat._id}`,
      {}, 
      config 
    );
    // setnotifications((prev) => {
    //   const alreadyExists = prev.some(
    //     (msg) => msg._id === newMessageRecieved.chat._id
    //   );
    //   if (!alreadyExists) {
    //     return [data, ...prev];
    //   }
    //   return prev;
    // });
    setfetch((prev) => !prev);
    setFetchTrigger(prev => !prev);
  } catch(error) {
    console.log(error);
    return toast.error("Error while adding a notification");
  }
}

  const handleNewMessage = (newMessageRecieved) => {
    if (!activechat || activechat._id !== newMessageRecieved.chat._id) {
      console.log("New message received in a different chat:", newMessageRecieved);
      HandleAddtonotification(newMessageRecieved);
    } else {
      setuserMessages((prev) => [...prev, newMessageRecieved]);
    }
  };

  
  socket.on("new Message Received", handleNewMessage);
  
  return () => {
    socket.off("new Message Received", handleNewMessage);
  };
}, [socket, activechat]);


  const handlSendMessages = async() =>{
    if(!message) return
    socket.emit("stop typing",activechat._id)
    try{
      const token = user.data.token;
      if(!token){
        return toast.error("No authentication token found.")
      }
      const config = {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
      const {data} = await axios.post('https://chatapp2-0-ss0n.onrender.com/ChatTogether/Message/',{content:message,chatId:activechat._id},config)
      socket.emit("new Message",data)
      setMessage('')
      setuserMessages((prev) => [...prev,data])
      setfetch(!fetch)
    }catch(error){
      return toast.error('Error while Sending Message')
    }
  }

  const HandelFitechChats = async()=>{
    if(!activechat) return 
    try{
      const Token = user.data.token;
      if (!Token) {
        toast.error("No authentication token found.");
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      };
      const {data} = await axios.get(`https://chatapp2-0-ss0n.onrender.com/ChatTogether/Message/${activechat._id}`,config)
      setuserMessages(data)
      if (socket) {
        socket.emit("join private chat", activechat._id);
      }
    }catch(error){
      console.log(error)
      return toast.error("Error while Fethcing chat")
    }
  }
  useEffect(()=>{
    HandelFitechChats()
  },[activechat])

const [typingTimeout, setTypingTimeout] = useState(null);

const HandelTypingInput = (e) => {
  const newMessage = e.target.value;
  setMessage(newMessage);
  if (!socketConnected) return;
  if (newMessage.length > 0 && !Typing) {
    setTyping(true);
    socket.emit("typing", activechat._id);
  }
  if (newMessage.length === 0 && Typing) {
    socket.emit("stop typing", activechat._id);
    setTyping(false);
  }
  if (typingTimeout) clearTimeout(typingTimeout);
  const newTimeout = setTimeout(() => {
    if (Typing) {
      socket.emit("stop typing", activechat._id);
      setTyping(false);
    }
  }, 3000);
  setTypingTimeout(newTimeout);
};




  const HandleAddtochat = async (userToAdd) => {
    if (activechat.groupAdmin._id !== user.data._id) {
      return toast.error("Only Group Admin Can Add Users");
    }
    try {
      const Token = user.data.token;
      if (!Token) {
        toast.error("No authentication token found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      };
      const { data } = await axios.put(
        'https://chatapp2-0-ss0n.onrender.com/ChatTogether/chat/groupadd',
        {
          chatId: activechat._id,
          userId: userToAdd._id, 
        },
        config
      );
      setactivechat(data); 
      setfetch(!fetch); 
      setsearchuser("")
      toast.success(`${userToAdd.username} has been added to the group.`);
    } catch (error) {
      toast.error("Error occurred while adding user to the group.");
    }
  };


  const HandleRemoveMember = async(Removinguser) =>{
    if(activechat.groupAdmin._id !==user.data._id){
        return toast.error("Only Group Admin Can Remove Users")
    }
    if(Removinguser._id ===user.data._id){
      return toast.warn("unable remove group admin")
    }
    try{
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
        const {data} = await axios.put('https://chatapp2-0-ss0n.onrender.com/ChatTogether/chat/groupremove',
          {chatId:activechat._id,userId:Removinguser._id},config)
          setactivechat(data);
          setfetch(!fetch)
    }catch(error){
      return toast.error("Error Occured!")
    }
  }

  const HandleChangeName = async() =>{
      if(activechat.groupAdmin._id !==user.data._id){
        return toast.error("Only Group Admin Can change the name")
      }
      if(!groupname){
        return toast.error("Please enter something to change")
      }
      try{
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
        const data = await axios.put('https://chatapp2-0-ss0n.onrender.com/ChatTogether/chat/rename',{ChatId:activechat._id,NewChatName:groupname},config)
        toast.success("Rename Group Succesfull")
          setactivechat((prev) => ({
              ...prev,
              chatName: groupname
          }));
        setfetch(!fetch)
        // setgroupname(activechat.chatName)
      }catch(error){
        return toast.error(`error will renameing${error}`)
      }
  }


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
        const {data}  = await axios.get(`https://chatapp2-0-ss0n.onrender.com/ChatTogether/user?search=${searchuser}`, config);
        setsearchresults(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users. Please try again.");
    }
  };

  const HandleLeaveGroup = async () => {  
    try {
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

      const { data } = await axios.put(
        'https://chatapp2-0-ss0n.onrender.com/ChatTogether/chat/groupremove',
        {
          chatId: activechat._id,
          userId: user.data._id  // Remove self
        },
        config
      );

      toast.success("You have left the group.");
      setactivechat(""); 
      HandleClose();
      setfetch(!fetch);   
      } catch (error) {
      toast.error("Error while leaving the group.");
    }
  };


  const HandelEditMode = () =>{
    seteditmode(true)
    setgroupname(activechat.chatName)
  }
  
  const bottomRef = useRef(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [userMessages]);

  useEffect(()=>{
    const delay = setTimeout(()=>{
      HandleSearchResults()
    },400)
    return () => clearTimeout(delay);
  },[searchuser])

  useEffect(()=>{
    setuserMessages([])
  },[activechat])
 
  const HandleClose = () =>{
    seteditmode(false)
    setgroupname(activechat.chatName)
    setgroupmembers([])
    setsearchuser("")
  }

  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [userMessages]);

  useEffect(()=>{
    setMessage("")
  },[activechat])

  const getData = (data) => {
    return (
      data.Users[0]._id === user.data._id ? data.Users[1] : data.Users[0]
    );
  }
  return (
    <>

      <div className="w-full h-full bg-[#1E40AF] p-1 rounded-xl text-white flex flex-col">
        {activechat ? (
          <>
            <div className="flex items-center gap-4 mb-2">
              <button onClick={() => setactivechat("")} className="text-xl px-3 py-1 bg-gray-700 rounded-lg cursor-pointer">
                ←
              </button>
              {activechat.isGroupChat === true ? (
                <>
                  <div className='flex flex-9 justify-center'>
                    {activechat.chatName}
                  </div>
                  <div className='flex flex-1 justify-end mr-2' onClick={HandelEditMode}>
                    <i className="fa-solid fa-pen-to-square cursor-pointer p-3 bg-[#4d515c] rounded-lg"></i>
                  </div>

                  {editmode && (
                    <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
                      <div className="bg-[#051235] rounded-2xl p-6 w-[90%] max-w-md shadow-2xl relative transform animate-fade-in">
                        <button
                          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl transition-transform hover:scale-110 cursor-pointer"
                          onClick={HandleClose}
                        >
                          ❌
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-center text-white">Edit Group Data</h2>
                        <div className="space-y-4">
                          <div className='flex flex-row'>
                            <input
                              placeholder="Enter the group name"
                              className="w-full px-4 py-2 border text-white border-[#ffffff] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              onChange={(e) => setgroupname(e.target.value)}
                              value={groupname}
                              disabled={activechat.groupAdmin._id !== user.data._id}
                            />
                            {activechat.groupAdmin._id === user.data._id && (

                              <button className="text-sm cursor-pointer p-2 ml-2 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg transition duration-200 font-medium"
                                onClick={HandleChangeName}>
                                Update
                              </button>)}
                          </div>
                          <div>
                            <div className='flex flex-wrap gap-2 mb-2 '>
                              {activechat.Users.map((member) => (
                                <Strip member={member} key={member._id} onClick={() => HandleRemoveMember(member)} />
                              ))}
                            </div>

                          </div>
                          {activechat.groupAdmin._id === user.data._id && (
                            <input
                              placeholder="Add the members"
                              className="w-full text-white border-[#ffffff] px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              onChange={(e) => setsearchuser(e.target.value)}
                              value={searchuser}
                            />
                          )}

                          <div
                            className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2 custom-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                            <div className="flex flex-wrap gap-2 mb-2">
                              {groupmembers.map((member) => (
                                <div
                                  key={member._id}
                                  className="bg-[#0088ff] text-white px-3 py-1 rounded-full text-xs flex items-center cursor-pointer"
                                >
                                  {member.username}
                                  <button
                                    className="ml-2 text-white font-bold hover:text-red-300 cursor-pointer"
                                    onClick={() =>
                                      setgroupmembers(groupmembers.filter((m) => m._id !== member._id))
                                    }
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                            {searchuser && searchresults?.length > 0 && searchresults.map((data) => (
                              <li key={data._id} className='list-none'>
                                <UserBox
                                  onClick={() => HandleAddtochat(data)}
                                  userdata={data}
                                  textsize={"text-sm"}
                                />
                              </li>
                            ))}
                          </div>
                          <div className='flex justify-center'>
                            <button className="text-sm cursor-pointer p-2 bg-[#ff001e] hover:bg-[#da0000] text-white py-2 rounded-lg transition duration-200 font-medium"
                              onClick={() => HandleLeaveGroup()}>
                              Leave Group
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-center w-full">
                    <Setname data={activechat} />
                  </div>
                  <Avatar
                    className="w-8 h-8 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 cursor-pointer mr-3"
                    user={getData(activechat)} />
                </>
              )}
            </div>
            
            <div
              className="flex-1 overflow-y-auto bg-white rounded-t-lg p-3 custom-scroll flex flex-col break-words 
              whitespace-pre-wrap"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', height: 'calc(100vh - 180px)'  }}
              ref={chatContainerRef}
            >
              {userMessages.map((message,index,arr) => {
                const isUser = message.sender._id === user.data._id;
                const showAvatar = !isUser && (index === 0 || arr[index - 1].sender._id !== message.sender._id);
                return (
                  <div
                    key={self.crypto.randomUUID()}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-1`}
                  >
                    {/* {showAvatar && 
                      (<Avatar className="w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 cursor-pointer mr-3"
                        user={message.sender.profile} />)} */}
                    <div
                      className={`relative py-1 rounded-lg text-sm max-w-[70%] shadow-md ${
                        isUser
                          ? 'bg-blue-500 text-white rounded-br-none pr-3 pl-3'
                          : 'bg-[#00ff99] text-black rounded-bl-none pl-3 pr-3'
                      }`}
                    >
                      {showAvatar && 
                      (
                        <div className='text-sm text-amber-700'>~{message.sender.username}</div>
                      )}
                      <div className="" >{message.content}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
 
            {istyping&&<div className=" p-2 bg-white">
                    <BeatLoader />
                  </div>}
            <div className="flex items-center gap-2 p-2 bg-white rounded-b-lg ">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-black border-1 border-gray-500 focus:outline-none"
                onChange={(e)=>HandelTypingInput(e)}
                value={message}
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlSendMessages();
                }
              }}
              />
              <button
                className="h-[40px] px-4 py-2 bg-white rounded-lg cursor-pointer border-2 border-gray-600"
                onClick={handlSendMessages}
              >
                <i className="fa-solid fa-paper-plane text-black"></i>
              </button>
            </div>
          </>
        ) :""}
      </div>
    </>
  );
}