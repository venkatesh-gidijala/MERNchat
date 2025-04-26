import React from 'react'
import { ChatState } from '../Context/ChatContext'

export default function Setname({data}) {
  const {user} = ChatState();
  return (
    data.Users[0]._id===user.data._id? data.Users[1].username: data.Users[0].username
  )
}



