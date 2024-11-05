// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String }, // For OTP verification
  isVerified: { type: Boolean, default: false }, // Verification status
  otpExpiresAt: { type: Number, default: Date.now() + 5 * 60 * 1000 },
});

export default mongoose.model("User", userSchema);
