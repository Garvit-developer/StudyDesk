const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadImages.js")

const {
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
} = require("../controllers/auth.controller.js");
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  ForgotPasswordValidation,
  verifyOTPValidation,
  ResetOTPValidation
} = require("../validations/auth.validation.js");
const validateInput = require("../middlewares/validateInput.js");
const isAuthenticated  = require("../middlewares/validateLogin.js");

router.post("/register", registerValidation, validateInput, register);
router.post("/login", loginValidation, validateInput, login);
router.post("/logout",isAuthenticated ,logout);
router.put('/update-profile',updateProfileValidation,validateInput,isAuthenticated,updateProfile);
router.put('/update-profile-pic', isAuthenticated, upload.single('profile_pic'), updateProfilePic);
router.delete('/delete-profile-pic', isAuthenticated, deleteProfilePic);
router.get('/me',getIsMe);
// Forgot Password,  - Send OTP
router.post('/forgot-password',ForgotPasswordValidation,validateInput,OTPSender);

// ResendOTP
router.post('/resend-otp',ForgotPasswordValidation,validateInput,OTPSender);

//verify fogot password otp
router.post('/verify-otp', verifyOTPValidation,validateInput,verifyOTP);
//reset password
router.post('/reset-password',ResetOTPValidation,validateInput,resetPassword);


//delte my account permanently
router.delete("/delete-account", isAuthenticated, deleteUserPermanently);



module.exports = router;
