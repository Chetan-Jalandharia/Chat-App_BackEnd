require("dotenv").config();
const { SetUserStatus, SetUserOffline, getSocket, ShowUsers, Login } = require('./Apis/Users/UserController')
// app initialization
const { createServer } = require('http')
const { Server } = require("socket.io")
const express = require("express");
const cors = require('cors')
const app = express()

// database initializaion
const db = require('./Config/db')
const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

const userRoute = require('./Routes/UserRoutes')
const messageRoute = require('./Routes/MessageRoutes')
const conversationRoute = require('./Routes/ConversationRoutes')


//middelware initialization
app.use(cors(corsOpts))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api/user", userRoute)
app.use("/api/message", messageRoute)
app.use("/api/conversation", conversationRoute)



const httpServer = createServer(app);
// Web Socket server initialization
const io = new Server(httpServer, {
    cors: {
        origin: "*",//used to allow connection with given domain
        // methods: ['GET', 'POST'],
        // credentials: true
    }
});


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to server"
    })
})



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