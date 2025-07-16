const userModel = require("../../models/Users");

const getUser = async (req, res) => {
  const { username } = req.query;

  try {
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const findUser = await userModel.findOne({ username: username.toLowerCase() })
      .select("username avatarURL bio");

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(findUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUser };
