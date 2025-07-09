const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const crypto = require('crypto');
const userModel = require('../models/Users');
const uploadSignature = (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const uploadPreset = 'Gramhub.io'
  const public_id = req.body.id
  let paramsToSign = `folder=gramhub/avtar&overwrite=true&public_id=${public_id}&timestamp=${timestamp}&upload_preset=${uploadPreset}`
  const signature = crypto.createHash('sha1')
    .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
    .digest('hex')
  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset,
    folder: 'gramhub/avtar',
    public_id,
    overwrite: true
  });
};
const updateProfilePhoto = async (req, res) => {
  const { imageUrl, id } = req.body;

  if (!imageUrl || !id) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { avatarURL: imageUrl },
      { new: true } // return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: updatedUser,
    });
  } catch (e) {
    console.error('Error updating profile photo:', e);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

const updateProfileData = async (req, res) => {
  const formData = req.body
  const { id } = req.user
  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, formData, { new: true })
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found or update failed.",
        success: false,
        formData:formData
      });
    }

    res.status(200).json({ message: "Profile updated successfully.", success: true })
  } catch (error) {
    console.error("Error updating user profile:", error); // professional logging
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
}
module.exports = { uploadSignature, updateProfilePhoto, updateProfileData };
