const Conversation = require("./ConversationModel")


exports.newConversation = async (req, res) => {
    const { senderId, receiverId } = req.body
    // console.log(senderId, receiverId);
    try {
        const chat = await Conversation.findOne({ $and: [{ members: senderId }, { members: receiverId }] })
        if (chat) {
            res.status(200).json({
                message: "conversation already exists",
                data: chat
            })
        }
        else {
            const NewConversation = new Conversation({
                members: [senderId, receiverId]
            })
            NewConversation.save()
                .then(val => {
                    res.status(200).json({
                        succes: true,
                        status: 200,
                        message: "New Conversation created",
                        data: val
                    })
                })
                .catch(err => {
                    res.status(400).json({
                        succes: false,
                        status: 400,
                        message: "Error occurs: " + err
                    })
                })
        }
    } catch (error) {
        res.status(500).json({
            succes: false,
            status: 500,
            message: "Error occurs: " + error
        })
    }
}

exports.showConversations = (req, res) => {
    const { userId } = req.params
    try {
        Conversation.find({
            members: { $in: [userId] }
        })
            .populate('members')
            .then(val => {
                res.status(200).json({
                    succes: true,
                    status: 200,
                    message: "Data Fetch success",
                    data: val
                })
            })
            .catch(err => {
                res.status(400).json({
                    succes: false,
                    status: 400,
                    message: "Error occurs: " + err
                })
            })
    } catch (error) {
        res.status(400).json({
            succes: false,
            status: 400,
            message: "Error occurs: " + error
        })
    }

}