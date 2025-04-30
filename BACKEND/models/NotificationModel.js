const mongooes = require('mongoose')

const notificationModel = mongooes.Schema({
    chatId:{
        type:mongooes.Schema.Types.ObjectId,
        ref:"chat",
    },
    receiverId:{
        type:mongooes.Schema.Types.ObjectId,
        ref:"userlogins",
    },
    count:{
        type:Number,
        default:1
    }
},{timestamps:true,})

const notification = mongooes.model('notification',notificationModel)
module.exports = notification
