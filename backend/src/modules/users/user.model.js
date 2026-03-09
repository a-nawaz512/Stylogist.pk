import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, select: false }, // select: false hides it from queries by default
  role: { type: String, enum: ['User', 'Staff', 'Super Admin'], default: 'User' },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpires: Date,
}, { timestamps: true });

// Composition: Pre-save hook to hash password
userSchema.pre('save', async function () {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return;

  // Hash the password with cost of 12 (highly secure, optimal for 2026 hardware)
  this.password = await bcrypt.hash(this.password, 12);
});

// Composition: Instance method to check password validity
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  // 1. Generate a raw random 32-byte hex string
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2. Hash it and store the hash in the DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Set expiration to 10 minutes from now
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // 4. Return the plaintext token to send via email
  return resetToken;
};

export const User = mongoose.model('User', userSchema);