const express = require('express')
const Route = express.Router();
const Protect = require('../MiddleWare/Verfiytoken');
const { AccessChats, FetchChats, Creategroup, Renamegroup, Addtogroup, RemoveFromGroup } = require('../Controller/ChatControll');

Route.route('/').post(Protect,AccessChats)
Route.route('/fetchchat').get(Protect,FetchChats)
Route.route('/group').post(Protect,Creategroup)
Route.route('/rename').put(Protect,Renamegroup)
Route.route('/groupadd').put(Protect,Addtogroup)
Route.route('/groupremove').put(Protect,RemoveFromGroup)

module.exports = Route