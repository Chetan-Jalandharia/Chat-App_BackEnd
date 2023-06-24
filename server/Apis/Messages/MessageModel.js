const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({

    conversationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
}, { timestamps: true })

module.exports = mongoose.model("Message", MessageSchema)