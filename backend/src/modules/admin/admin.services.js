
import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';

// 🔹 Sign JWT token
export const signToken = (id) => jwt.sign({ id }, env.jwtSecret, { expiresIn: '7d' });

// 🔹 Create JWT cookie
export const sendToken = (user, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions || [],
  };
};

// 🔹 Admin login service
export const adminLoginService = async ({ email, password }) => {
  // Find user including password
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');

  // Check role
  if (!['Staff', 'Super Admin'].includes(user.role)) {
    throw new ApiError(403, 'Access denied. Not an admin.');
  }

  // Check password

  console.log("Compare", password);


  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) throw new ApiError(401, 'Invalid Password');

  return user;
};

// 🔹 Create new Staff/Admin service
export const createAdminService = async ({ name, email, password, phone, role, permissions = [] }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already in use');

  // Super Admins implicitly bypass permission checks; storing the array is
  // harmless but we don't require it on the input.
  const newAdmin = await User.create({
    name,
    email,
    phone,
    password,
    role,
    permissions: role === 'Staff' ? permissions : [],
  });

  return newAdmin;
};

// 🔹 List all admin users (Staff + Super Admin) for the permissions screen.
export const listStaffService = async () => {
  const staff = await User.find({ role: { $in: ['Staff', 'Super Admin'] } })
    .select('_id name email role permissions isBlocked createdAt')
    .sort({ createdAt: -1 })
    .lean();
  return staff;
};

// 🔹 Replace a staff member's permission set. Super Admin's own permissions
//    are immutable (they bypass the gate anyway), so we no-op for that role
//    rather than silently rewriting the array.
export const updateStaffPermissionsService = async (id, permissions) => {
  const user = await User.findById(id).select('_id role permissions');
  if (!user) throw new ApiError(404, 'Staff member not found');

  if (user.role === 'Super Admin') {
    throw new ApiError(400, "Super Admin permissions can't be edited — the role bypasses all checks.");
  }
  if (user.role !== 'Staff') {
    throw new ApiError(400, 'Permissions can only be set on Staff users.');
  }

  user.permissions = [...new Set(permissions)];
  await user.save();
  return user.toObject();
};