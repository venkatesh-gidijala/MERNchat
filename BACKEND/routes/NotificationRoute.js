const express = require("express");
const { createNotification, getnotifications, removenotifications } = require("../Controller/NotificationController");
const Protect = require("../MiddleWare/Verfiytoken");
const Router = express.Router();

Router.post('/',Protect,createNotification);
Router.get('/getnotifications',Protect,getnotifications);
Router.delete('/removenotifications',Protect,removenotifications);

module.exports = Router;