const postModel = require("../../models/Post");
const userModel = require("../../models/Users");

const updateFollower = async (req, res) => {
  const { follower_id } = req.params;
  const { id: user_id } = req.user;
  const { operation } = req.query;

  console.log(follower_id, user_id, operation);

  try {
    // Basic validation
    if (!user_id || !follower_id || !operation) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prevent self-follow
    if (follower_id === user_id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Validate operation
    if (!["addToSet", "pull"].includes(operation)) {
      return res.status(400).json({ message: "Invalid operation" });
    }

    // Ensure both users exist
    const [targetUser, currentUser] = await Promise.all([
      userModel.findById(follower_id),
      userModel.findById(user_id),
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User(s) not found" });
    }

    // Update follower/following arrays
    const updatedFollower = await userModel.findByIdAndUpdate(
      follower_id,
      { [`$${operation}`]: { followers: user_id } },
      { new: true }
    );

    const updatedFollowing = await userModel.findByIdAndUpdate(
      user_id,
      { [`$${operation}`]: { following: follower_id } },
      { new: true }
    );

    // Confirm both succeeded
    if (!updatedFollower || !updatedFollowing) {
      return res.status(500).json({ message: "Failed to update follow data" });
    }

    return res.status(200).json({
      message: `User ${operation === "push" ? "followed" : "unfollowed"} successfully`,
      follower: updatedFollower,
      following: updatedFollowing,
    });
  } catch (e) {
    console.error("Follow error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateFollower };
