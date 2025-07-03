const userModel = require("../models/Users")
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
require('dotenv').config()
const jwt_secret_key = process.env.JWT_SECRET_KEY
const generateHashPass = async (password) => {
    const saltRound = await bcryptjs.genSalt(12)
    const hashPassword = await bcryptjs.hash(password, saltRound)
    return hashPassword
}
const verifyPassword = async (password, hashPassword) => {
    const isMatch = await bcryptjs.compare(password, hashPassword)
    return isMatch
}
const generateToken = async (payload) => {
    const token = await jwt.sign(payload, jwt_secret_key, { expiresIn: "1hr" })
    return token
}
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
        const hashPassword = await generateHashPass(password)
        const response = await userModel.create({ username, email, password: hashPassword })
        if (response) {
            const payload = {
                id: response._id,
                username: response.username,
                email: response.email
            }
            const token = await generateToken(payload)
            console.log(token)
            return res.status(200).json({ message: "Registration Successfull", token: token })
        }
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" })
    }

}
const loginUser = async (req, res) => {
    const authPayload = req.body
    if (!authPayload) {
        return res.status(401).json({ message: "Fill all credentials" })
    }
    try {
        if (authPayload?.email) {
            const response = await userModel.findOne({ email: authPayload.email })
            if (response) {
                const isVerify = await verifyPassword(authPayload.password, response.password)
                if (isVerify) {
                    const payload = {
                        id: response._id,
                        username: response.username,
                        email: response.email
                    }
                    const token = await generateToken(payload)
                    return res.status(200).json({ message: "Login Successfull", token: token })
                } else {
                    return res.status(402).json({ message: "Password is invalid" })
                }
            } else {
                return res.status(402).json({ message: "Email not found" })
            }
        } else if (authPayload?.username) {
            const response = await userModel.findOne({ username: authPayload.username })
            if (response) {
                const isVerify = await verifyPassword(authPayload.password, response.password)
                if (isVerify) {
                    const payload = {
                        id: response._id,
                        username: response.username,
                        email: response.email
                    }
                    const token = await generateToken(payload)
                    return res.status(200).json({ message: "Login Successfull", token: token })
                } else {
                    return res.status(402).json({ message: "Password is invalid" })
                }
            } else {
                return res.status(402).json({ message: "Username not found" })
            }
        } else {
            return res.status(401).json({ message: "Fill all credentials" })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Internal server error" })
    }

}
const getCurrentUser = (req, res) => {
    const user = req.user
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ user: user })
}


module.exports = { registerUser, loginUser, getCurrentUser }