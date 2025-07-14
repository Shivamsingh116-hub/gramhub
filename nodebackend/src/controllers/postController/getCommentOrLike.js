const postModel = require("../../models/Post");

const getCommentOrLike = async (req, res) => {
    const { postId } = req.params;
    const { type } = req.query; // 'like' or 'comment'

    try {
        if (!type || !['comment', 'like'].includes(type)) {
            return res.status(400).json({ message: "Invalid or missing type parameter" });
        }

        const post = await postModel.findById(postId)
            .populate('comments.userId', 'username avatarURL')
            .populate('likes', 'username avatarURL');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (type === 'comment') {
            return res.status(200).json({ comments: post.comments });
        } else if (type === 'like') {
            return res.status(200).json({ likes: post.likes });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getCommentOrLike };
