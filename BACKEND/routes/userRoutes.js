const express = require('express');
const { Registraion, Login, searchusers } = require('../Controller/UserControll');
const route = express.Router()
const multer = require('multer');
const Protect = require('../MiddleWare/Verfiytoken');
const upload = multer();


route.post('/',upload.none(),Registraion)
route.post('/login',Login)
route.get('/',Protect,searchusers)
module.exports = route