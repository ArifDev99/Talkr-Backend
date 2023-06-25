const express=require("express");
const dotenv=require("dotenv")

const app=express();
const userRoutes=require("./Routes/userRoutes")
const chatRoutes=require("./Routes/chatRoutes")
const messageRoutes=require("./Routes/messageRoutes");


const http=require("http").Server(app);
const cors = require('cors');
const connectDB = require("./config/db2");
const { log } = require("console");
const { loadavg } = require("os");
const { disconnect } = require("process");


dotenv.config();
connectDB();



app.use(cors())

// Accept JSON
app.use(express.json());

// Acceept body
app.use(express.urlencoded({extended:true}))

// const server=http.createServer(app);
// const io=new Server(server);
 

const io= require('socket.io')(http, {
    cors: {
        origin: "http://127.0.0.1:5173"
    }
});

io.on('connection', (socket) => {
  
    socket.on("setup",(userData)=>{
      console.log(`⚡: ${userData._id} user just connected!`);
      if(userData && userData._id){

        socket.join(userData._id);
        socket.emit("Connected",socket.id);
      }else{
        console.log("userdat is missing");
      }
    })

    socket.on("join chat",(room)=>{
      socket.join(room)
      console.log("user joined room: "+room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("send_message",function(newMessageRecieved){
      var chat=newMessageRecieved.chat
      if(!chat.users) return console.log("Chat.users not defined");

      chat.users.forEach(user => {
       
        if(user._id === newMessageRecieved.sender._id) return ;

        socket.in(user._id).emit("message recieved",newMessageRecieved)
      });
      // io.sockets.emit("update",data);
      // console.log(data)
    })

    // socket.on('disconnect', () => {
    //   console.log('🔥: A user disconnected');
    // });
    socket.on('disconnect',()=>{
      console.log("USER DISCONNECTED");
      socket.off("setup", () => {
        socket.leave(userData._id);
      });

    })
});


app.use("/api/v1/user",userRoutes);

app.use("/api/v1/chat",chatRoutes);
app.use("/api/v1/message",messageRoutes);


// app.get('/', (req, res) => {
//     res.json({
//       message: 'Hello world',
//     });
//   });
  



http.listen(4000,function(){
    console.log("server running at Port 4000");
})