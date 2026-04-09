/**
 * User Auth Controller
 * Handles Public User Sign In (OTP/Google)
 */

const User = require('../models/User');
const { sendOTPEmail } = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /api/auth/send-otp
 * Generates and sends a 6-digit OTP to the user's email.
 */
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save({ validateBeforeSave: false });
  } else {
    // For new users, we will create them when OTP is verified
    // Actually, let's create a placeholder user to store the OTP
    const seed = Math.random().toString(36).substring(7);
    user = await User.create({
      name: email.split('@')[0],
      email: email.toLowerCase(),
      otp,
      otpExpiresAt,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      // No password for OTP users
    });
  }

  const emailSent = await sendOTPEmail(user.email, otp, user.name);

  return res.json({
    success: true,
    message: 'OTP sent to email',
    // In development mode, return OTP in response for testing if email fails
    otp: process.env.NODE_ENV === 'development' ? otp : undefined,
  });
};

/**
 * POST /api/auth/verify-otp
 * Verifies the OTP and returns a JWT.
 */
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiresAt');

  if (!user || !user.otp || user.otp !== otp) {
    return res.status(401).json({ success: false, message: 'Invalid OTP' });
  }

  if (new Date() > user.otpExpiresAt) {
    return res.status(401).json({ success: false, message: 'OTP has expired' });
  }

  // Clear OTP
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = user.generateJWT();

  return res.json({
    success: true,
    message: 'Sign in successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

/**
 * POST /api/auth/google-login
 * Registers or logs in a user with a Google token.
 */
exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  if (!tokenId) {
    return res.status(400).json({ success: false, message: 'Google token ID is required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) {
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    const { email, name, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ 
      $or: [{ googleId }, { email: email.toLowerCase() }] 
    });

    if (user) {
      user.googleId = googleId; // Link googleId if it was just matched by email
      user.name = name;
      user.avatar = picture;
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        avatar: picture,
        lastLogin: new Date(),
      });
    }

    const token = user.generateJWT();

    return res.json({
      success: true,
      message: 'Google sign in successful',
      token,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
};
