const postModel = require("../../models/Post")
const user =require('../../models/Users')
const updateComment = async (req, res) => {
    const { postId } = req.params
    const { id: userId } = req.user
    const { text } = req.body

    try {
        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        userId,
                        text,
                    },
                },
            },
            { new: true }
        )

        console.log(updatedPost)
        const newComment = updatedPost.comments[updatedPost.comments.length - 1]
        res.status(200).json({ comment: newComment })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { updateComment }
