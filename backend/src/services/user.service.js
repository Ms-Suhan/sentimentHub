require('dotenv').config()

const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

function setUser(user){
    const userr = {
        id: user._id.toString(),
        username: user.username,
        email : user.email
    }
    return jwt.sign(userr, secret)
}

function getUser(token){
    if(!token) return null

    return jwt.verify(token, secret)
} 

module.exports = {
    setUser,
    getUser
}