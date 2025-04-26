const asyncHandler = require("express-async-handler")
const userModel = require('../models/UserModel')
const generateToken = require('../MiddleWare/generateToken')
const bcrypt = require('bcrypt')

const Registraion = asyncHandler(async (req, res) => {
  try {
    const { userName, email, password ,profile} = req.body;
    const userExists = await userModel.findOne({email:email});
    if (userExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (!userName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username: userName,
      email,
      password: hashPassword,
      profile
    });
    const savedUser = await newUser.save();
    if(savedUser){
        const token = generateToken(savedUser._id)
        res.status(200).json(savedUser,token);
        console.log(token)
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const Login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.findOne({ username });
        if (!user) {
        return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }


        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            profile: user.profile ,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

const searchusers = asyncHandler(async(req,res)=>{
    const keyword = req.query.search?{
      $or:[
          {user:{$regex:req.query.search,$options:"i"}},
          {email:{$regex:req.query.search,$options:"i"}}
      ]
    }:{};
    try{
      const users = await userModel.find(keyword).find({ _id: { $ne: req.user._id } });
      res.send(users);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users" });
    }
})

module.exports = {Registraion,Login,searchusers}