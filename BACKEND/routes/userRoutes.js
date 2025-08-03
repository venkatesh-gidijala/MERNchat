const express = require('express');
const { Registration, Login, searchusers } = require('../Controller/UserControll');
const route = express.Router()
const multer = require('multer');
const Protect = require('../MiddleWare/Verfiytoken');
const upload = multer();


route.post('/',upload.none(),Registration)
route.post('/login',Login)
route.get('/',Protect,searchusers)
module.exports = route