const { ShowMessages, SendMessage } = require('../Apis/Messages/MessageController')

const router = require('express').Router()

router.get("/show/:conversationId", ShowMessages)
router.post("/send", SendMessage)




module.exports = router