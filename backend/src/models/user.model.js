const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const {ApiError} = require('../services/ApiError')
const { setUser } = require('../services/user.service')


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    salt: {
        type: String
    }
},{timestamps: true})


UserSchema.pre("save", async function(next){
    const user = this;

    if(!user.isModified('password')) return next

    const saltRounds = 10

    this.password = await bcrypt.hash(this.password, saltRounds)

    next

})

UserSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
    const user = await User.findOne({email})

    if(!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) throw new Error('invalid password')

    const token = setUser(user)

    return token


}

const User = mongoose.model("User", UserSchema)

module.exports = User