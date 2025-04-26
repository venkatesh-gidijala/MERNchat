const Chat = require('../models/ChatModel')
const Message = require('../models/MessageModel')
const AsyncHandler = require('express-async-handler')

const sendMessage = AsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).send({ message: "Invalid data passed into request" });
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "username email profile");
        message = await message.populate("chat");
        message = await message.populate({
            path: "chat.Users", 
            select: "username email profile",
        });
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
        res.json(message);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Error occurred while sending message" });
    }
});

const fetchMessages = AsyncHandler(async(req,res)=>{
    try{
        const messages = await Message.find({chat:req.params.chatId}).
        populate("sender", "username email profile").
        populate("chat")
        res.json(messages)
    }catch(error){
        console.error(error);
        return res.status(400).send({ message: "Error occurred while Fetching messages" });
    }
})

module.exports = {sendMessage,fetchMessages}