import React from 'react'
import Avatar from './Avatar'

function UserBox({onClick,userdata,className="",textsize}) {
  return (
    <div onClick={onClick} className={`${className} m-1 hover:bg-[#68b1a0] bg-white border-2 border-[#0e1016] shadow-sm shadow-black px-2 py-3 rounded-lg my-3 cursor-pointer flex items-center`} >
        <div onClick={(e) => e.stopPropagation()}>
        <Avatar user={userdata} className='cursor-pointer w-14 h-14 mr-3' />
      </div>
        <div className='flex flex-col' >
            <div className={`${textsize} text-black`}>{userdata.username}</div>
            <div className={`${textsize} text-black`}>email:{userdata.email}</div>
        </div>
    </div>
  )
}

export default UserBox