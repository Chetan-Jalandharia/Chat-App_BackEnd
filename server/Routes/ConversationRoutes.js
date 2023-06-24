const { newConversation, showConversations } = require('../Apis/Conversations/ConversationController')

const router = require('express').Router()

router.post("/createnew", newConversation)
router.get("/show/:userId", showConversations)



module.exports = router