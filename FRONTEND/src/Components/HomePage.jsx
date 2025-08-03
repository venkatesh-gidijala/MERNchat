import React, { useState } from 'react' 
import { ChatState } from '../Context/ChatContext';
import TopBar from '../ChatComponents/TopBar';
import LeftChat from '../ChatComponents/LeftChat';
import RigthChat from '../ChatComponents/RigthChat';
import ToolTip from '../SubComponents/ToolTip';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const { user, activechat ,selected,setselected} = ChatState();
  const navigate = useNavigate();
  const [fetch, setfetch] = useState(false);
  const HandleLogOut = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };
  console.log(selected)
  return (
    <div className='bg-black'> 
      <div className="h-screen flex flex-col justify-between overflow-hidden">
        {user && <TopBar/>}
        <div className="flex h-[calc(100%-64px)]">
          <div className="min-w-[50px] w-[4%] max-w-[60px] bg-[#212a42] p-2 rounded-xl m-1 flex flex-col justify-between">
            <ul className="text-sm flex flex-col items-center">
              <div className='space-y-6'>
                <button className='cursor-pointer' onClick={() => setselected(1)}>
                  <div className={`relative group w-full p-2 rounded-lg flex items-center justify-center mb-3
                      ${selected === 1 
                        ? 'bg-blue-600 shadow-lg transform scale-105 border-2 border-blue-400' 
                        : 'bg-[#10172a]'
                      }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                    {/* <ToolTip name="Chats" className="left-full md:block"/> */}
                  </div>
                </button>
              </div>
              <div className='mt-auto space-y-4 w-full flex flex-col items-center'>
                <button className='cursor-pointer'  onClick={()=>setselected(2)}>
                  <div className={`relative group bg-[#10172a] rounded-lg p-3 flex items-center justify-center ${selected === 2 
                        ? 'bg-blue-600 shadow-lg transform scale-105 border-2 border-blue-400' 
                        : 'bg-[#10172a]'
                      }`}>
                    <i className="fa-solid fa-gear"></i>
                    <ToolTip name="Settings" className="left-full"/>
                  </div>
                </button>
                <button className='cursor-pointer'  onClick={()=>setselected(3)}>
                  <div className={`relative group bg-[#10172a] rounded-lg p-3 flex items-center justify-center ${selected === 3
                  
                  
                        ? 'bg-blue-600 shadow-lg transform scale-105 border-2 border-blue-400' 
                        : 'bg-[#10172a]'
                      }`}>
                    <i className="fa-solid fa-user"></i>
                    <ToolTip name="Account" className="left-full"/>
                  </div>
                </button>
                <button onClick={HandleLogOut} className='cursor-pointer '>
                  <div className='relative group bg-[#10172a] rounded-lg p-3 flex items-center justify-center'>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <ToolTip name="LogOut" className="left-full"/>
                  </div>
                </button>
              </div>
            </ul>
          </div>
          <div className={`md:w-[30%] ${activechat ? "hidden md:block" : "w-full"} bg-[#F3F4F6] pt-4 px-2 rounded-xl m-1 overflow-hidden`}>
            <div className="font-bold mb-2 text-3xl overflow-y-auto h-full">
              {user && <LeftChat fetch={fetch}/>}
            </div>
          </div>
          <div className={`md:w-[66%] ${!activechat ? "hidden md:block" : "w-full"} bg-[#1E40AF] p-0.5 m-1 rounded-xl overflow-hidden`}>
            <div className='text-black overflow-y-auto h-full'>
              {user && <RigthChat fetch={fetch} setfetch={setfetch}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 
}

export default HomePage;