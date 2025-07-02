const mongoose = require('mongoose')
const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    }, otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000)
    }
})
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
const otpModel = mongoose.model("otpData", OtpSchema)
module.exports = otpModel