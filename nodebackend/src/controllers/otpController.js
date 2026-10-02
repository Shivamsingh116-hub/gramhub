const otpModel = require("../models/Otp");
const userModel = require("../models/Users");
const { Resend } = require("resend");
require("dotenv").config();
const resend = new Resend(process.env.RESEND_API_KEY);
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const existingEmail = await otpModel.findOne({ email });
    if (existingEmail && existingEmail.otp === otp) {
      await otpModel.deleteMany({ email });
      return res.status(200).json({ message: "Verified ✔" });
    } else {
      return res.status(406).json({ message: "Invalid otp" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Internal Server errror" });
  }
};

const sendOtp = async (req, res) => {
    const { email, isSignup } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });

        if (!existingUser && !isSignup) {
            return res.status(409).json({
                message: "No accounts from this email"
            });
        }

        if (existingUser && isSignup) {
            return res.status(409).json({
                message: "Email is already in use!"
            });
        }

        const existingOtp = await otpModel.findOne({ email });

        if (existingOtp) {

            const { data, error } = await resend.emails.send({
                from: "GramHub <onboarding@resend.dev>",
                to: [email],
                subject: `Secure Sign-In Code: ${existingOtp.otp}`,
                text: `Your OTP is: ${existingOtp.otp}`,
                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 20px;
                        background-color: #f9f9f9;
                    ">
                        <h2 style="color: #333;">
                            🔐 Your Secure Sign-In Code
                        </h2>

                        <p style="font-size: 18px; color: #555;">
                            Use the code below to complete your login:
                        </p>

                        <div style="
                            font-size: 32px;
                            font-weight: bold;
                            color: #2e5aac;
                            margin: 20px 0;
                        ">
                            ${existingOtp.otp}
                        </div>

                        <p style="font-size: 14px; color: #888;">
                            This code will expire in 10 minutes.
                        </p>
                    </div>
                `
            });

            if (error) {
                console.error("Resend error:", error);

                return res.status(500).json({
                    message: "Failed to send OTP to email."
                });
            }

            return res.status(200).json({
                message: `OTP send to ***${email.slice(-15)}`
            });
        }

        const generateOtp = () =>
            String(Math.floor(100000 + Math.random() * 900000));

        const otp = generateOtp();

        const { data, error } = await resend.emails.send({
            from: "GramHub <onboarding@resend.dev>",
            to: [email],
            subject: `Secure Sign-In Code: ${otp}`,
            text: `Your OTP is: ${otp}`,
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                    background-color: #f9f9f9;
                ">
                    <h2 style="color: #333;">
                        🔐 Your Secure Sign-In Code
                    </h2>

                    <p style="font-size: 18px; color: #555;">
                        Use the code below to complete your login:
                    </p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        color: #2e5aac;
                        margin: 20px 0;
                    ">
                        ${otp}
                    </div>

                    <p style="font-size: 14px; color: #888;">
                        This code will expire in 10 minutes.
                    </p>
                </div>
            `
        });

        if (error) {
            console.error("Resend error:", error);

            return res.status(500).json({
                message: "Failed to send OTP to email."
            });
        }

        console.log("OTP sent:", data);

        await otpModel.deleteMany({ email });

        await otpModel.create({
            email,
            otp
        });

        return res.status(200).json({
            message: `OTP send to ***${email.slice(-15)}`
        });

    } catch (err) {
        console.error("Server error:", err);

        return res.status(500).json({
            message: "Failed to send OTP to email."
        });
    }
};

module.exports = { verifyOtp, sendOtp };
