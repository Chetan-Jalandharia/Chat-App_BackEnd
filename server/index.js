require("dotenv").config();
const { SetUserStatus, SetUserOffline } = require('./Apis/Users/UserController')
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


const userRoute = require('./Routes/UserRoutes')
const messageRoute = require('./Routes/MessageRoutes')
const conversationRoute = require('./Routes/ConversationRoutes')

app.use("/api/user", userRoute)
app.use("/api/message", messageRoute)
app.use("/api/conversation", conversationRoute)



// Socket Event Emitters for data transmision
io.on("connection", (socket) => {
    console.log("User Connected With id: ", socket.id);
    // users.push(socket.id)
    // socket.on("send", (data) => {
    //     // users.push(data)
    //     console.log(data);
    //     // io.to(users[0].socket).emit("receive", "hello")
    // })
    socket.on("setStatus", (data) => {
        // console.log(data);
        SetUserStatus(data)
        io.emit("statusUpdate", { online: true })
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