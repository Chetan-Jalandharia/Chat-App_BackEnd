const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    image: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRthZcF6C12-eMC0JrJdv4CWO40-emM4BBFlw&usqp=CAU" },
    name: { type: String, default: "", required: true },
    email: { type: String, default: "", unique: true, required: true },
    password: { type: String, default: "", required: true },

    isOnline: { type: Boolean, default: false },
    socketId: { type: String, default: "" },

    loginLogs: [{
        ip: { type: String, default: '' },
        loginTime: { type: Date, default: Date.now() },
        isLoged: { type: Boolean, default: false }
    }],

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model("User", userSchema)