const User = require('../models/user.model')
const {getUser} = require('../services/user.service')


function checkForAuthentication(req, res, next) {
    const token = req.cookies?.token

    if(!token) return next()

    const user = getUser(token)
    req.user = user

    return next()
}

function authorizeUser(roles){
    return (req, res, next) => {
        if(!req.user) return res.redirect('/user/signup')

        if(roles.includes(req.user.role)) return res.json({"Message": "Unauthorized"})

        next()
    }
}

module.exports = {
    checkForAuthentication,
    authorizeUser
}