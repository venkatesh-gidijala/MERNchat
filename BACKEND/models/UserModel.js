const mongoose = require('mongoose');
const User = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
    }
},{timestamps:true})
const mongoos = mongoose.model('userlogins',User)
module.exports = mongoos
