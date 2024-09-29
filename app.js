require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json())

const dbURI = process.env.MONGODB_URL

const pollRouter = require('./Routes/Poll')
const userRouter = require('./Routes/user')

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.listen(3001);
        console.log("Connected")
    })
    .catch ((err) => {
        console.log("Error connecting to MongoDB: ", err)
    })

    app.use("/vote", pollRouter)
    app.use("/user", userRouter)
