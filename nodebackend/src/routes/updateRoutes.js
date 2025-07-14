const express = require('express')
const verifyToken = require('../middleware/auth')
const { updateLikes } = require('../controllers/postController/likeController')
const { updateComment } = require('../controllers/postController/commentController')
const updateRouter = express.Router()
updateRouter.put('/likes/:postId',verifyToken,updateLikes)
updateRouter.post('/:postId/comment',verifyToken,updateComment)
module.exports={updateRouter}