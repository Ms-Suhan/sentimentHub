const express = require('express')
const { handleUserLogin, handleUserRegister} = require('../controllers/user.controller')

const router = express.Router()

router.post("/login", handleUserLogin)

router.post("/register", handleUserRegister)


module.exports = router