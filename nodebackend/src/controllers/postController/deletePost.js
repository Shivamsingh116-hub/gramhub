const postModel = require('../../models/Post');

const cloudinary = require('../../config/cloudinary');

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        // 1. Find post by ID
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        if (post.image?.public_id) {
            await cloudinary.uploader.destroy(post.image.public_id);

        }

        // 4. Delete post from DB
        await postModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error while deleting post' });
    }
};

module.exports = { deletePost };
