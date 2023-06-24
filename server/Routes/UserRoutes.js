const multer = require('multer')
const { Register, Login, Logout, SearchUser, ShowUsers } = require('../Apis/Users/UserController')

const router = require('express').Router()
const storageData = multer.memoryStorage()
const upload = multer({ storage: storageData })

router.post("/register", upload.single("image"), Register)
router.post("/login", Login)
router.post("/logout", Logout)

router.get("/show", ShowUsers)
router.post("/searchUser", SearchUser)


module.exports = router