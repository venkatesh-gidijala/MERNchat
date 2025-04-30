const User = require('../models/UserModel')
const Message = require('../models/MessageModel')
const AsyncHandler = require('express-async-handler')
const Chat  = require('../models/ChatModel')

const AccessChats = AsyncHandler(async(req,res)=>{
    const {userId} = req.body;
    if(!userId){
        console.log("UserId params not send with request")
        return res.sendStatus(400)
    }
    var isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {Users:{$elemMatch:{$eq:req.user._id}}},
            {Users:{$elemMatch:{$eq:userId}}},
        ]
    }).populate("Users","-password").populate("latestMessage")

    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"username email profile"
    })
    if(isChat.length > 0){
        res.send(isChat[0])
    }else{
        var newchat = {
            chatName:"Sender",
            isGroupChat:false,
            Users:[req.user._id,userId]
        }
        try{
            const createChat = await Chat.create(newchat)
            const FullChat = await Chat.findOne({_id:createChat._id}).populate("Users","-password")
            res.status(200).send(FullChat)
        }catch(error){
            res.status(400).send({message:"Error creating New Chat"})
        }
    }
})

const FetchChats = AsyncHandler(async(req,res)=>{
    try{
        const UserChats = await Chat.find({Users:{$elemMatch:{$eq:req.user._id}}}).populate("Users","-password")
        .populate("latestMessage")
        .populate("groupAdmin","-password")
        .sort({updatedAt:-1})
        const FullChat = await User.populate(UserChats,{
            path:"latestMessage.sender",
            select:"username email profile"
        }
        )
        res.status(200).send(FullChat)
    }catch(error){
        res.status(400).send({message:"Error Fetching Chats"})
    }
})

const Creategroup = AsyncHandler(async(req,res)=>{  
    if(!req.body.Users || !req.body.chatName){
        return res.status(400).send({message:"fill all the fields"})
    }
    let Users = req.body.Users;
    if (typeof Users === "string") {
        try {
            Users = JSON.parse(Users);
        } catch (error) {
            return res.status(400).send({ message: "Invalid Users format" });
        }
    }
    if(Users.length < 2){
        return res.status(400).send({message:"Minimum requirement for creating group is 2"})
    }
    Users.push(req.user)
    try{
        const NewGroupChat = await Chat.create({
            chatName:req.body.chatName,
            isGroupChat:true,
            Users:Users,
            groupAdmin:req.user,
        })
        const groupchattoreturn = await Chat.findOne({_id:NewGroupChat._id}).populate("Users","-password")
        .populate("groupAdmin","-password")
        res.status(200).send(groupchattoreturn)
    }catch(error){
        res.status(400).send({message:"Error Creating group Chat"})
    }
})

const Renamegroup = AsyncHandler(async(req,res)=>{
    const {ChatId,NewChatName} = req.body;
    const updatedchat = await Chat.findByIdAndUpdate(ChatId,
        {chatName:NewChatName},
        {new:true}
    ).populate("Users","-password")
    .populate("groupAdmin","-password")
    if(!updatedchat){
         res.status(400).send({message:"Group Not Found"})
    }else{
        res.json(updatedchat)
    }
})

const Addtogroup = AsyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;
    const added = await Chat.findByIdAndUpdate(chatId,
        {
        $push:{Users:userId},
        },{
            new:true
        }
    ).populate("Users","-password").populate("groupAdmin","-password")
    if(!added){
        res.status(400).send({message:"Chat Not Found"})
    }else{
        res.json(added)
    }
})

const RemoveFromGroup = AsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res.status(400).json({ message: "chatId and userId are required" });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    chat.Users = chat.Users.filter(
      (user) => user.toString() !== userId.toString()
    );
    await chat.save();
    const updatedChat = await Chat.findById(chatId)
      .populate("Users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("RemoveFromGroup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = {AccessChats,FetchChats,Creategroup,Renamegroup,Addtogroup,RemoveFromGroup}