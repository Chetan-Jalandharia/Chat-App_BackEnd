const Message = require("./MessageModel")

exports.ShowMessages = (req, res) => {

    const { conversationId } = req.params

    try {
        Message.find({
            conversationId
        })
            .then(val => {
                res.status(200).json({
                    succes: true,
                    status: 200,
                    message: "Data fetch success",
                    data: val
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


exports.SendMessage = (req, res) => {

    const { conversationId, senderId, text } = req.body

    const NewMessage = new Message({
        conversationId, senderId, text
    })
    NewMessage.save()
        .then(val => {
            res.status(200).json({
                succes: true,     
                status: 200,
                message: "Message Send",
                data:val
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