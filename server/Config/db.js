const mongoose = require('mongoose')
require('dotenv').config()

let dbpath = process.env.DB_PATH;

mongoose.connect(dbpath)
    .then(value => {
        console.log("DataBase Connected");
    })
    .catch((err) => {
        console.log(err);
    })