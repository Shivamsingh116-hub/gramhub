const express = require('express')
const { uploadSignature, updateProfilePhoto } = require('../controllers/profileController')
const verifyToken = require('../middleware/auth')
const uploadRouter = express.Router()
uploadRouter.post('/get-upload-signature', verifyToken, uploadSignature)
uploadRouter.put('/update-profile-photo', updateProfilePhoto)
module.exports = uploadRouter