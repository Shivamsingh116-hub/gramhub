const postModel = require("../../models/Post");
const userModel = require("../../models/Users");

const getProfileShowData = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await userModel
      .findOne({ username })
      .select("username name gender avatarURL bio createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const posts = await postModel
      .find({ userId: user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      user,
      posts,
    });
  } catch (err) {
    console.error("Error in getProfileShowData:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getProfileShowData };
