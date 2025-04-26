const mongooes = require('mongoose')

const ChatModel = mongooes.Schema({
        chatName:{
            type:String,
            trim:true
        },
        isGroupChat:{
            type:Boolean,
            default:false
        },
        Users:[ 
        {
            type:mongooes.Schema.Types.ObjectId,
            ref:"userlogins",
        },
        ],
        latestMessage:{
            type:mongooes.Schema.Types.ObjectId,
            ref:"Message",
        },
        groupAdmin:{
            type:mongooes.Schema.Types.ObjectId,
            ref:"userlogins",
        },
},{timestamps:true,})

const chat  = mongooes.model('chat',ChatModel)
module.exports = chat