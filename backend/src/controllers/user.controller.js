const User = require('../models/user.model')
const {setUser} = require('../services/user.service')


async function handleUserRegister(req, res){
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400)
        return res.json({"Message" : "All Fields are necessary"})
    }

    await User.create({
        username: name,
        email,
        password
    })

    res.redirect('/')
}


// async function handleUserLogin(req, res) {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({
//                 message: "All fields are required"
//             });
//         }

//         const user = await User.findOne({ email, password });

//         if (!user) {
//             return res.status(401).json({
//                 message: "Invalid credentials"
//             });
//         }

//         const token = setUser({
//             id: user._id,
//             name: user.username,
//             email: user.email,
//             role: user.role
//         });

//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "lax"
//         });

//         return res.status(200).json({
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.username,
//                 email: user.email,
//                 role: user.role
//             }
//         });
//     } catch (error) {
//         console.error("Login error:", error);

//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// }

async function handleUserLogin(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const token =
            await User.matchPasswordAndGenerateToken(email, password);

        return res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        if (error.message === "Invalid credentials") {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        return next(error);
    }
}


module.exports = {
    handleUserLogin,
    handleUserRegister
}
