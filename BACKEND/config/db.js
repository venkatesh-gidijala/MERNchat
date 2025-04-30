const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const mongoosconnection = async () => {
    try {
        const uri = process.env.MONGO_URL;
        await mongoose.connect(uri);
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
module.exports = mongoosconnection;
