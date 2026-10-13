require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const dbConnect = require('./config/db')

const {authorizeUser, checkForAuthentication} = require('./middlewares/auth.middleware')

const PORT = process.env.PORT || 3000

const app = express();


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())



dbConnect();



const authRouter = require('./routes/user.route')



app.use("/api/v1", require("./routes/index.route"));


// app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.json({message: "Mern Backend is running"})
})




app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

