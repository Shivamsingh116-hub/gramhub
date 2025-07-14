const postModel = require("../../models/Post")

const updateLikes = async (req, res) => {
    const { postId } = req.params
    const { id: userId } = req.user
    try {
        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        const alreadyLiked = post.likes.includes(userId)
        let updatePost
        if (alreadyLiked) {
            updatePost = await postModel.findByIdAndUpdate(postId,
                { $pull: { likes: userId } },
                { new: true })
        } else {
            updatePost = await postModel.findByIdAndUpdate(postId,
                { $addToSet: { likes: userId } },
                { new: true }
            )
        }
        res.status(200).json({
            message: alreadyLiked ? "Like removed" : "Post liked",
            likes: updatePost.likes
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}
module.exports = { updateLikes }