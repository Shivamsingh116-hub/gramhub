const express=require('express')
const verifyToken = require('../middleware/auth')
const { deletePost } = require('../controllers/postController/deletePost')
const deleteRouter=express.Router()
deleteRouter.delete('/post/:id',verifyToken,deletePost)
module.exports={deleteRouter}