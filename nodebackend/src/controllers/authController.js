const userModel = require("../models/Users")
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwt_secret_key = process.env.JWT_SECRET_KEY
const registerUser = async (req, res) => {
    const { username, email, password } = req.body
    console.log(username)
    if (!username || !email || !password) {
        return res.status(401).json({ message: "Please fill all fields" })
    }
    const userExist = await userModel.findOne({ username: username })
    if (userExist) {
        return res.status(402).json({ message: "Username already exist" })
    }
    const emailExist = await userModel.findOne({ email: email })
    if (emailExist) {
        return res.status(402).json({ message: "Email is already in use" })
    }
    try {
        const response = await userModel.create({ username, email, password })
        if (response) {
            const payload = {
                id: response._id,
                username: response.username,
                email: response.email
            }
            const token = jwt.sign(payload, jwt_secret_key, { expiresIn: '1hr' })
            console.log(token)
            return res.status(200).json({ message: "Registration Successfull", token: token })
        }
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" })
    }

}
const loginUser = (req, res) => {
    res.send('login!');
    console.log("Reciever lOGIN")
}
const getCurrentUser = (req, res) => {
    const user = req.user
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ user: user })
}


module.exports = { registerUser, loginUser, getCurrentUser }