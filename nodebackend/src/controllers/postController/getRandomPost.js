const postModel = require("../../models/Post")
const userModel = require('../../models/Users')
const getRandomPost = async (req, res) => {
    try {
        const { lastCreatedAt } = req.query
        const query = lastCreatedAt
            ? { createdAt: { $lt: new Date(lastCreatedAt) } }
            : {};
        const randomPost = await postModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("userId", "username avatarURL")

        res.status(200).json(randomPost);
    } catch (err) {
        console.error("Error in getRandomPost:", err);
        res.status(500).json({ message: "Failed to fetch random post" });
    }

}
module.exports = { getRandomPost }