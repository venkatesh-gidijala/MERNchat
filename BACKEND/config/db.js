const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')
const mongoosconnection = async() =>{
    try{
        const uri = process.env.MONGO_URL || "mongodb://localhost:27017/mernchat";
        const connect = await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }catch(error){
        console.log(error)   
        process.exit()
     }
}
module.exports = mongoosconnection