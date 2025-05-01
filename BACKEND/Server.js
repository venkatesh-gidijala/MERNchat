const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
// app.use(cors());
app.use(cors({
  origin: ["https://chatapp2-0-ss0n.onrender.com", "http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());
dotenv.config();
const path = require("path")

const mongoosconnection = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const ChatRoute = require('./routes/ChatRouter')
const MessageRoute = require('./routes/MessageRoute')
const NotificationRoute = require('./routes/NotificationRoute')
//user
app.use('/ChatTogether/user',userRoutes)
// //chat  
app.use('/ChatTogether/chat',ChatRoute)
// //message
app.use('/ChatTogether/message',MessageRoute)
// // notification
app.use('/ChatTogether/notification',NotificationRoute)


const __dirname1 = path.resolve();  

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1,'..', 'FRONTEND', 'dist')));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1,'..', 'FRONTEND', 'dist', 'index.html'));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}


mongoosconnection();
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT,()=>{ 
    console.log("Server started on port 3001");
})

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["https://chatapp2-0-ss0n.onrender.com", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join private chat",(roomid)=>{
    socket.join(roomid);
    console.log("user is enter into room:"+roomid)
  })

  socket.on("new Message",(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat;
    if(!chat.Users) return console.log("user not defined")
    chat.Users.forEach((user)=>{
        if(user._id === newMessageRecieved.sender._id) return;
        socket.in(user._id).emit("new Message Received",newMessageRecieved)
    })
  })

  socket.on("typing",(room)=>{
    socket.in(room).emit("typing");
  })

  socket.on("stop typing",(room)=>{
    socket.in(room).emit("stop typing");
  })
});

