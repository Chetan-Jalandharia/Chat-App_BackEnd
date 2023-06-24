const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema({

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
}, { timestamps: true })

module.exports = mongoose.model("Conversation", ConversationSchema)