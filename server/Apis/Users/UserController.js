const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./UserModel");
const path = require('path')

const Storage = require('../../Config/firebase')
const ref = require('firebase/storage').ref
const uploadBytes = require('firebase/storage').uploadBytes
const getURL = require('firebase/storage').getDownloadURL

exports.Register = async (req, res) => {
    const { name, email, password } = req.body

    const image = req.file.buffer
    // console.log(image);
    const imgName = `User_${Date.now()}${path.extname(req.file.originalname)}`;

    const isName = /([a-zA-Z\s]){2,30}$/;
    const isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


    try {
        try {

            const imgRef = ref(Storage, `Users/${imgName}`)
            const imgData = await uploadBytes(imgRef, image)
            var filePath = await getURL(imgData.ref)
        } catch (error) {
            console.log("error occur in firebase storage: ", error);
        }

        if (!(isName.test(name)) || !(isEmail.test(email))) {
            res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid Data Format"            
            })
        }
        User.findOne({ email: email }).then(val => {
            if (val) {
                res.status(403).json({
                    success: false,
                    status: 403,
                    message: "Email Already Exists"
                })
            }

            let newUser = new User()
            newUser.image = filePath
            newUser.name = name
            newUser.email = email
            newUser.password = bcrypt.hashSync(password, 10)

            newUser.save()
                .then(data => {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "Registration success",
                        data
                    })
                })
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            status: 400,
            message: "Error Occurs: " + error
        })
    }
}

exports.Login = (req, res) => {
    const { email, password } = req.body
    try {
        User.findOne({ email: email })
            .then(val => {
                let logger = {
                    ip: req.ip,
                    isLoged: false
                }
                if (!val) {
                    res.status(403).json({
                        success: false,
                        status: 404,
                        message: "User not Exists"
                    })
                }
                if (!(bcrypt.compareSync(password, val.password))) {
                    res.status(401).json({
                        success: false,
                        status: 401,
                        message: "Invalid Credentials"
                    })
                }
                let token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 * 30 });
                val.isOnline = true
                val.loginLogs.push(logger)
                val.save()
                    .then(data => {
                        res.status(200).json({
                            success: true,
                            status: 200,
                            message: "Login success",
                            token,
                            data
                        })
                    })

            })
    } catch (error) {
        res.status(400).json({
            success: false,
            status: 400,
            message: "Error Occurs: " + error
        })
    }

}

exports.Logout = (req, res) => {
    const { email } = req.body
    User.findOne({ email: email })
        .then(val => {
            val.isOnline = false
            val.save()
                .then(data => {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "Logout success",
                        data
                    })
                })
        })
}


exports.ShowUsers = (req, res) => {

    User.find({ status: true })
        .then(val => {
            res.status(200).json({
                success: true,
                status: 200,
                message: "Data fetch success",
                data: val
            })
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                message: "Error Occurs: " + err
            })
        })
}
exports.SearchUser = (req, res) => {
    const { name } = req.body
    User.find({ status: true, name })
        .then(val => {
            res.status(200).json({
                success: true,
                status: 200,
                message: "Data fetch success",
                data: val
            })
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                message: "Error Occurs: " + err
            })
        })
}

exports.SetUserStatus = (data) => {
    const { userId, socketId } = data;

    try {

        User.findOne({ _id: userId })
            .then(val => {
                val.isOnline = true
                val.socketId = socketId
                val.save()
                // .then(val=>{
                //     console.log(val);
                // })

            })
    } catch (error) {
        console.log(error);
    }

}
exports.SetUserOffline = (id) => {
    try {


        User.findOne({ socketId: id })
            .then(val => {
                if (val) {
                    // console.log(val);
                    val.isOnline = !val.isOnline
                    val.socketId = ""
                    val.save()
                }

            })
    } catch (error) {
        console.log(error);
    }

}