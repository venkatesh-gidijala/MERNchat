import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import Setname from '../SubComponents/Setname';
import UserBox from '../SubComponents/UserBox';
import Strip from '../Customcomponents/strip';

export default function LeftChat({ fetch }) {
  const { user, activechat, setactivechat, localchats, setlocalchats, notification } = ChatState();
  const [activategroupchat, setactivategroupchat] = useState(false);
  const [groupname, setgroupname] = useState("");
  const [groupmembers, setgroupmembers] = useState([]);
  const [searchuser, setsearchuser] = useState("");
  const [searchresults, setsearchresults] = useState();
  const [loading, setLoading] = useState(false);

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
      if (searchuser.length !== 0) {
        const { data } = await axios.get(`https://chatapp2-0-ss0n.onrender.com/ChatTogether/user?search=${searchuser}`, config);
        setsearchresults(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users. Please try again.");
    }
  };

  const fetchchats = async () => {
    try {
      setLoading(true);
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
      const { data } = await axios.get('https://chatapp2-0-ss0n.onrender.com/ChatTogether/chat/fetchchat', config)
      setlocalchats(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users. Please try again.");
      setLoading(false);
    }
  }

  const HandleCreateGroup = async () => {
    if (!groupname) {
      return toast.warn("Please enter the group name")
    }
    if (groupmembers.length < 2) {
      return toast.warn("Minimum 2 users are required to create a group")
    }
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
      const { data } = await axios.post('https://chatapp2-0-ss0n.onrender.com/ChatTogether/chat/group', {
        chatName: groupname,
        Users: groupmembers.map((u) => u._id)
      }, config)
      setlocalchats([data, ...localchats]);
      setactivategroupchat(false)
      setactivechat(data)
      setgroupmembers([])
      setgroupname("")
      setsearchuser("")
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Group creation failed!");
    }
  }

  const HandleAddtochat = (data) => {
    const isAlreadyAdded = groupmembers.some((member) => member._id === data._id);
    if (isAlreadyAdded) {
      toast.warn(`${data.username} is already added`);
      return;
    }
    setgroupmembers([...groupmembers, data]);
    setsearchuser("");
  };

  const HandleClose = () => {
    setactivategroupchat(false)
    setgroupname("")
    setgroupmembers([])
    setsearchuser("")
  }

  const handleActivateChat = (chat) => {
    setactivechat(chat);
    setlocalchats((prevChats) => {
      const filtered = prevChats.filter((c) => c._id !== chat._id);
      return [chat, ...filtered];
    });
  };

  useEffect(() => {
    if (activechat && activechat._id) {
      handleActivateChat(activechat);
    }
  }, [activechat]);

  useEffect(() => {
    const delay = setTimeout(() => {
      HandleSearchResults()
    }, 400)
    return () => clearTimeout(delay);
  }, [searchuser])

  useEffect(() => {
    fetchchats();
  }, [fetch, notification])

  return (
    <>
      <div className='overflow-x-hidden '>
        <div className=' flex flex-row flex-wrap w-full rounded-lg'>
          <div className='py-1 w-1/2 truncate text-base sm:text-2xl md:text-xl overflow-visible lg:text-2xl flex justify-start pl-2 md:pl-3 text-black'>
            Chats
          </div>
          <div onClick={() => setactivategroupchat(true)} className='py-2 text-lg font-medium hover:bg-[#797c88] w-1/2 truncate rounded-2xl cursor-pointer flex justify-center bg-[#555862]'>
            <i className="fa-solid fa-plus mt-1 2/3 mr-2 text-base sm:text-lg md:text-sm lg:text-lg"></i>
            <span className='text-base sm:text-lg md:text-sm lg:text-lg' >Create Group Chat</span>
          </div>
        </div>
        <div className='flex flex-col overflow-y-auto h-[calc(100vh-160px)]' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {loading ? (
           <div className="flex flex-col space-y-2 mt-4">
              {[...Array(10)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-gray-500 animate-pulse rounded-lg h-16 w-full"
                ></div>
              ))}
            </div>

          ) : (
            localchats.map((data) => (
              <div className={`text-black pl-4 cursor-pointer py-3 rounded-lg text-sm mt-2 ${activechat._id === data._id ? 'bg-[#4992d1]' : 'bg-[#9ca4bd]'}`}
                key={data._id}
                onClick={() => setactivechat(data)}>
                {data.isGroupChat === true ? <>
                  <div>{data.chatName}</div>
                  {data.latestMessage ? (<div className="flex items-center space-x-2 mt-2">
                    <span className="font-semibold text-pink-900">~ {data.latestMessage?.sender?.username}:</span>
                    <span className=" text-xs truncate">{data.latestMessage?.content}</span>
                  </div>) : <div className='text-xs  mt-1'> <span className='text-pink-700 text-lg'>~</span> Chat is empty. Send a message to start.</div>}
                </>
                  : <>
                    <div>
                      <Setname data={data} />
                    </div>
                    {data.latestMessage ? (<div className="flex items-center space-x-2 mt-2">
                      <span className="font-semibold text-pink-900">~ {data.latestMessage?.sender?.username}:</span>
                      <span className="text-xs truncate">{data.latestMessage?.content}</span>
                    </div>) : <div className='text-xs  mt-1'> <span className='text-pink-700 text-lg'>~</span> Chat is empty. Send a message to start.</div>}
                  </>}
              </div>
            ))
          )}
        </div>
      </div>
      {activategroupchat && (
        <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-[#051235] rounded-2xl p-6 w-[90%] max-w-md shadow-2xl relative transform animate-fade-in">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl transition-transform hover:scale-110 cursor-pointer"
              onClick={HandleClose}
            >
              ❌
            </button>
            <h2 className="text-xl font-semibold  mb-4 text-center text-white">Create Group Chat</h2>
            <div className="space-y-4">
              <input
                placeholder="Enter the group name"
                className="w-full px-4 py-2 border text-white border-[#ffffff] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                onChange={(e) => setgroupname(e.target.value)}
              />
              <input
                placeholder="Add the members"
                className="w-full text-white border-[#ffffff] px-4 py-2 border  rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                onChange={(e) => setsearchuser(e.target.value)}
                value={searchuser}
              />
              <div
                className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2 custom-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >

                <div className="flex flex-wrap gap-2 mb-2">
                  {groupmembers.map((member) => (
                    <Strip
                      key={member._id}
                      member={member}
                      onClick={() =>
                        setgroupmembers(groupmembers.filter((m) => m._id !== member._id))
                      }
                    />
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
                <button className="text-sm cursor-pointer p-2 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg transition duration-200 font-medium"
                  onClick={HandleCreateGroup}>
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
