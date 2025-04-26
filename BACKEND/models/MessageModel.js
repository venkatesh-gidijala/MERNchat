const mongooes = require('mongoose')

const Message = mongooes.Schema({
    sender:{
        type:mongooes.Schema.Types.ObjectId,
        ref:"userlogins",
    },
    content:{
        type:String,
        trim:true,
    },
    chat:{
        type:mongooes.Schema.Types.ObjectId,
        ref:"chat",
    }
},{timestamps:true})

const MessageModel = mongooes.model('Message',Message)
module.exports = MessageModel