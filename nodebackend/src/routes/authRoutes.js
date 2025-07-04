const express = require('express')
const { registerUser, loginUser, getCurrentUser, changePassword } = require('../controllers/authController')
const verifyToken = require('../middleware/auth')
const { verifyOtp, sendOtp } = require('../controllers/otpController')
const router = express.Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/verifyOtp', verifyOtp)
router.post('/sendOtp', sendOtp)
router.post('/forgot-password', changePassword)
router.get('/me', verifyToken, getCurrentUser)
module.exports = router
// ✘✔