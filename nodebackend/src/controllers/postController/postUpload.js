const { nanoid } = require('nanoid')
const crypto = require('crypto')
const postModel = require('../../models/Post')
require('dotenv').config()

const uploadPostSignature = (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000)
    const { folder } = req.body
    const { id } = req.user

    const public_id = `${id}/${nanoid(10)}`
    const upload_preset = 'GramHub.post'
    const fullFolder = `gramhub/${folder}`

    const paramsToSign =
        `folder=${fullFolder}&public_id=${public_id}&timestamp=${timestamp}&upload_preset=${upload_preset}`

    const signature = crypto
        .createHash('sha1') // ✅ Correct hash algorithm
        .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
        .digest('hex')

    res.json({

        uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
        fields: {
            timestamp: timestamp,
            signature: signature,
            api_key: process.env.CLOUDINARY_API_KEY,
            upload_preset: upload_preset,
            folder: fullFolder,
            public_id: public_id,
        }

    })
}
const uploadPost = async (req, res) => {
    const { fileUrl, public_id, caption } = req.body
    const { id } = req.user
    try {
        if (!fileUrl || !public_id) {
            return res.status(400).json({ message: "Upload failed. Please try again." })
        }
        const uploadRes = await postModel.create({ userId: id, image: { url: fileUrl, public_id: public_id }, details: caption })
        if (!uploadRes) {
            return res.status(400).json({ message: "Upload failed. Please try again." })
        }
        return res.status(200).json({
            message: "Upload successfull",
            postData: uploadRes
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { uploadPostSignature, uploadPost }