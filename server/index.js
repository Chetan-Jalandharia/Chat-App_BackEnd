require("dotenv").config();
const { SetUserStatus, SetUserOffline, getSocket } = require('./Apis/Users/UserController')
// app initialization
const express = require("express");
const cors = require('cors')
const app = express()

// database initializaion
const db = require('./Config/db')

//middelware initialization
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// initialize http server for web socket
const httpServer = require("http").createServer(app);

// Web Socket server initialization
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5173",//used to allow connection with given domain
    }
});

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to server"
    })
})

const userRoute = require('./Routes/UserRoutes')
const messageRoute = require('./Routes/MessageRoutes')
const conversationRoute = require('./Routes/ConversationRoutes')

app.use("/api/user", userRoute)
app.use("/api/message", messageRoute)
app.use("/api/conversation", conversationRoute)



// Socket Event Emitters for data transmision
io.on("connection", (socket) => {
    console.log("User Connected With id: ", socket.id);
   
    socket.on("setStatus", (data) => {
        SetUserStatus(data)
        io.emit("statusUpdate", { online: true })
    })
    
    socket.on("sendMessage", async (data) => {
        data.createdAt = Date.now()
        const receiver_socket = await getSocket(data?.receiverId)
        console.log("retun data:", receiver_socket)

        io.to(receiver_socket).emit("receiveNewMessage", data)
    })

    socket.on("disconnect", () => {
        console.log("diconnected", socket.id);
        SetUserOffline(socket.id)
        io.emit("statusUpdate", { online: false })

    })
});


httpServer.listen(process.env.PORT || 5000, () => {
    console.log(`server running at port ${process.env.PORT || 5000}`);
}); 