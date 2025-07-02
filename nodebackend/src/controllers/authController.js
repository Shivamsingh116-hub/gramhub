const userModel = require("../models/Users")

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
            return res.status(200).json({ message: "Registration Successfull" })
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
    res.send('get cureent user!');
    console.log("Reciever currentUser")
}


module.exports = { registerUser, loginUser, getCurrentUser }