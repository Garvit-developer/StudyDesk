const fs = require("fs").promises;
const path = require("path");
const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  createUser,
  updateProfilePicPath,
  findUserById,
  updateUserProfile,
  clearOTP,
  updatePassword,
  updateOTP
} = require("../models/user.model.js");
const { sendOTPEmail, sendPasswordChangedEmail } = require("../utils/email");
const { hashPassword, comparePassword } = require("../utils/password");
const { createToken } = require("../utils/token");
const db = require("../config/db.js");

// REGISTER
const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const name = `${firstname.trim()} ${lastname.trim()}`;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await hashPassword(password);
    const userId = await createUser(name, email, hashed);

    res.status(201).json({
      message: "User registered successfully",
      userId,
      name,
      email,

    });
  } catch (err) {
    console.error("[Register Error]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      userId: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      mobile: user.mobile,
      profile_pic: user.profile_pic,
      created_at: user.created_at,
      tokenSetInCookie: true,
    });
  } catch (err) {
    console.error("[Login Error]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// UPDATE PROFILE PIC
const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No profile picture uploaded" });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture
    if (user.profile_pic) {
      const oldPicPath = path.join(__dirname, "..", user.profile_pic);
      try {
        await fs.access(oldPicPath);
        await fs.unlink(oldPicPath);
      } catch (err) {
        console.warn("[No old image to delete]", err.message);
      }
    }

    const newProfilePath = req.file.path;
    await updateProfilePicPath(userId, newProfilePath);

    // Refresh token with updated data
    const updatedUser = await findUserById(userId);
    const token = createToken(updatedUser);

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Profile picture updated",
      profile_pic: `${req.protocol}://${req.get("host")}/${newProfilePath}`,
      tokenRefreshed: true,
    });
  } catch (err) {
    console.error("[Update Profile Pic Error]", err.message);
    res.status(500).json({
      message: "Something went wrong while updating profile picture",
    });
  }
};

// DELETE PROFILE PIC
const deleteProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user || !user.profile_pic) {
      return res.status(404).json({ message: "No profile picture to delete" });
    }

    const picPath = path.join(__dirname, "..", user.profile_pic);

    try {
      await fs.access(picPath);
      await fs.unlink(picPath);
    } catch (err) {
      console.warn("[Delete Profile Pic] File not found:", err.message);
    }

    await updateProfilePicPath(userId, null);

    // Refresh token
    const updatedUser = await findUserById(userId);
    const token = createToken(updatedUser);

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Profile picture deleted successfully",
      tokenRefreshed: true,
    });
  } catch (err) {
    console.error("[Delete Profile Pic Error]", err.message);
    res
      .status(500)
      .json({ message: "Something went wrong while deleting profile picture" });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstname, lastname, email, address, mobile } = req.body;
    const newName = `${firstname?.trim() || ""} ${lastname?.trim() || ""}`.trim();

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await findUserByEmail(email);
      if (emailExists && emailExists.id !== userId) {
        return res
          .status(400)
          .json({ message: "Email already in use by another account" });
      }
    }

    const updatedFields = {
      name: newName || user.name,
      email: email || user.email,
      address: address || user.address,
      mobile: mobile || user.mobile,
    };

    await updateUserProfile(userId, updatedFields);

    // Refresh token with updated name/email
    const updatedUser = await findUserById(userId);
    const token = createToken(updatedUser);

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      updated: updatedFields,
      tokenRefreshed: true,
    });
  } catch (err) {
    console.error("[Update Profile Error]", err.message);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// GET USER FROM COOKIE
const getIsMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(200).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: decoded.id, name: decoded.name, email: decoded.email, address: decoded.address, mobile: decoded.mobile, profile_pic: decoded.profile_pic, created_at: decoded.created_at });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// delete user permanently
const deleteUserPermanently = async (req, res) => {
  const userId = req.user.id;

  try {
    const sql = "DELETE FROM users WHERE id = ?";
    const [result] = await db.query(sql, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User and all related AI responses deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ message: "Server error. Could not delete user." });
  }
};

// Forgot Password - Send OTP, ResendOTP  - Send OTP
const OTPSender = async (req, res) => {
  try {
    const { email } = req.body;

    // Check user existence
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Save OTP in DB
    await updateOTP(user.id, otp, otpExpiry);

    // Send OTP via email
    await sendOTPEmail(email, otp);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify forgot-password OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid email" });

    // Validate OTP and expiry
    if (user.otp !== otp || new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid email" });

    // Check OTP validity again for safety
    if (user.otp !== otp || new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash and update password
    const hashed = await hashPassword(newPassword);
    await updatePassword(user.id, hashed);

    // Clear OTP after reset
    await clearOTP(user.id);

    try {
      await sendPasswordChangedEmail(email);
      res.json({ message: "Password reset and email sent" });
    } catch {
      res.json({ message: "Password reset, but email failed" });
    }
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  register,
  login,
  logout,
  updateProfilePic,
  deleteProfilePic,
  updateProfile,
  getIsMe,
  deleteUserPermanently,
  OTPSender,
  verifyOTP,
  resetPassword
};
