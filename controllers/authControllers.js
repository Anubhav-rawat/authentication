import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendOTPEmail } from "../utils/emailService.js";

// User registration and OTP sending
export const registerUser = async (req, res) => {
  const { username, email, mobile, password } = req.body;

  // Check if a user with this email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Generate a temporary OTP (One-time password)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Create a new user object
  const user = new User({
    username,
    email,
    mobile,
    password: await bcrypt.hash(password, 10), // Hash the password for storage
    otp, // Store OTP temporarily
    otpExpiresAt: Date.now() + 5 * 60 * 1000, // OTP expiry time (5 minutes)
  });

  console.log(user);
  try {
    // Send OTP to the user's email
    await sendOTPEmail(email, otp);
    await user.save(); // Save the user to the database with hashed password and OTP
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error sending OTP email" });
  }

  res.status(200).json({ message: "User registered. OTP sent successfully." });
};

// Verify OTP and complete registration
export const verifyOTP = async (req, res) => {
  const { otp } = req.body; // Only OTP is required now

  // Find the most recently registered user with the OTP that has not been verified yet
  const user = await User.findOne({
    otp,
    otpExpiresAt: { $gt: Date.now() },
    isVerified: false,
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
  }

  // OTP is correct, clear OTP and mark the user as verified
  user.otp = null; // Clear OTP after verification
  user.isVerified = true; // Mark the user as verified
  await user.save();

  res.status(200).json({ message: "OTP verified, registration complete." });
};
