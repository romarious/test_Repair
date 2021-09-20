const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const auth = require("./routes/auth")
const verifyToken = require("./middlewares/verifyToken")
const User = require('./models/User')
const {MONGO_URI, PORT} = require("./config")

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
.connect(MONGO_URI , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => console.log("MongoDB is connected"))
.catch(err => console.log(err))

app.use('/', auth)
app.get('/secret', verifyToken, async (req, res) => {
    const id = req.user.userId

    const userInfo = await User.findById(id)
    const {email, userName} = userInfo

    res.status(200).send({email, userName})
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
