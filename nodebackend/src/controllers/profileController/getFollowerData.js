const userModel = require("../../models/Users");

const getFollowData = async (req, res) => {
    const { type } = req.params;
    const { follow_id } = req.query;

    try {
        if (!follow_id || !type) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const validTypes = ['followers', 'following'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid type value. Must be 'followers' or 'following'." });
        }

        const findUser = await userModel
            .findById(follow_id)
            .select(type)
            .populate(type, 'username avatarURL');

        if (!findUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (!findUser[type] || findUser[type].length === 0) {
            return res.status(200).json({ message: `No ${type} found.`, data: [] });
        }

        return res.status(200).json({ data: findUser[type] });

    } catch (err) {
        console.error("getFollowData error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getFollowData };
