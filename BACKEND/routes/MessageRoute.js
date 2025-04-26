
const express = require('express')
const Route = express.Router();
const Protect = require('../MiddleWare/Verfiytoken');
const { sendMessage, fetchMessages } = require('../Controller/MessageController');

Route.post('/',Protect,sendMessage)
Route.get('/:chatId',Protect,fetchMessages)

module.exports =  Route