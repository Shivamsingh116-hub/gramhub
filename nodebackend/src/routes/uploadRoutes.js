const express = require('express')
const { uploadSignature, updateProfilePhoto, updateProfileData } = require('../controllers/profileController')
const verifyToken = require('../middleware/auth')
const uploadRouter = express.Router()
uploadRouter.post('/get-upload-signature', verifyToken, uploadSignature)
uploadRouter.put('/update-profile-photo', verifyToken, updateProfilePhoto)
uploadRouter.put(`/update-profile-data`, verifyToken, updateProfileData)
module.exports = uploadRouter