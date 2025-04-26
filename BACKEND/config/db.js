const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL;
const mongoosconnection = async() =>{
    try{
        const connect = await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    }catch(error){
        console.log(error)   
        process.exit()
     }
}
module.exports = mongoosconnection