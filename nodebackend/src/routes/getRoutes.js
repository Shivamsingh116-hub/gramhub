const express = require('express')
const verifyToken = require('../middleware/auth')
const { getRandomPost } = require('../controllers/postController/getRandomPost')
const getRouter = express.Router()
getRouter.get('/random-post', verifyToken, getRandomPost)
module.exports = { getRouter }