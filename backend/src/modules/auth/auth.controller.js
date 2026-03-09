import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { sendEmail } from '../../utils/email.js';
import { createSendToken } from './auth.service.js';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import crypto from 'node:crypto';

const signToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

const generateNumericOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res, next) => {
  const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });

  if (existingUser) {
    // If user exists but isn't verified, we could tell the frontend to redirect to OTP page
    if (!existingUser.isVerified) {
      return next(new ApiError(403, 'Account exists but is unverified. Please request a new OTP.'));
    }
    return next(new ApiError(409, 'Email or phone number is already in use.'));
  }

  // 1. Generate 6-Digit Code
  const otp = generateNumericOTP();

  // 2. Create user (Bcrypt hook fires automatically)
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    isVerified: false, // MUST add this to your schema
    // Hash the OTP before saving to DB
    otp: crypto.createHash('sha256').update(otp).digest('hex'),
    otpExpires: Date.now() + 10 * 60 * 1000, // Valid for 10 minutes
  });

  // 3. Send Email
  try {
    await sendEmail({
      email: newUser.email,
      subject: "Stylogist - Verify Your Identity",
      message: `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
    
    <p>Please verify your identity, <b>${newUser.name}</b></p>

    <p>Here is your <b>Stylogist verification code:</b></p>

    <div style="
      font-size:32px;
      font-weight:bold;
      letter-spacing:6px;
      margin:20px 0;
    ">
      ${otp}
    </div>

    <p>This code is valid for <b>10 minutes</b> and can only be used once.</p>

    <p>Please don't share this code with anyone. We'll never ask for it via phone or email.</p>

    <br/>

    <p>Thanks,<br/>
    <b>The Stylogist Team</b></p>

    <hr/>

    <p style="font-size:12px;color:#666;">
      You're receiving this email because a verification code was requested for your Stylogist account. 
      If this wasn't you, please ignore this email.
    </p>

  </div>
  `,
    });
    const token = signToken(newUser._id);

    // 4. Remove password from the output completely
    newUser.password = undefined;

    // Notice we do NOT send the token here anymore. 
    res.status(201).json({
      status: 'success',
      token,
      message: 'Account created. Please check your email for the OTP.',
      data: { email: newUser.email } // Send email back so frontend knows who to verify
    });
  } catch (error) {
    // If email fails, delete the user so they can try registering again
    await User.findByIdAndDelete(newUser._id);
    return next(new ApiError(500, 'Error sending verification email. Please try again.'));
  }
};

export const forgotPassword = async (req, res, next) => {
  // 1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(404, 'There is no user with that email address.'));
  }

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // Skip Zod/Mongoose strict validation for this quick save

  // 3. Send it to user's email
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `Forgot your password? Submit a new password to: \n${resetURL}\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message,
    });

    res.status(200).json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    // If email fails, we MUST wipe the token from the DB to prevent dangling access
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, 'There was an error sending the email. Try again later!'));
  }
};

export const resetPassword = async (req, res, next) => {
  // 1. Get user based on the token (we must hash the incoming token to match the DB)
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user where token matches AND expiration is strictly in the future
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token has not expired, and there is a user, set the new password
  if (!user) {
    return next(new ApiError(400, 'Token is invalid or has expired'));
  }

  user.password = req.body.password;

  // Force invalidation of the token immediately
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save(); // This triggers our pre('save') Bcrypt hook perfectly

  // 3. Log the user in automatically, send JWT
  createSendToken(user, 200, res);
};

export const login = async (req, res, next) => {
  const { email, password } = req.validated.body;

  // 1. Check if email & password exist
  if (!email || !password) {
    return next(new ApiError(400, 'Please provide email and password'));
  }

  // 2. Find user + explicitly select password (since select: false in schema)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ApiError(401, 'Incorrect email or password'));
  }

  // 3. Check if password is correct using instance method
  const isCorrect = await user.correctPassword(password, user.password);
  if (!isCorrect) {
    return next(new ApiError(401, 'Incorrect email or password'));
  }

  // 4. Remove password from output
  user.password = undefined;

  // 5. Send JWT
  createSendToken(user, 200, res);
}

// ========================
// LOGOUT
// ========================
export const logout = (req, res) => {
  // 1. Overwrite JWT cookie (if using cookie) or instruct client to remove token
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};