const postModel = require("../../models/Post"); // Adjust path as needed

const getUserPosts = async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const posts = await postModel.find({ userId: userId }).sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user." });
        }
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return res.status(500).json({ message: "Server error while fetching user posts." });
    }
};

module.exports = { getUserPosts };
