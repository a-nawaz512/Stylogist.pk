// src/modules/admin/admin.validation.js
import { z } from 'zod';
import { ALL_PERMISSIONS } from '../permissions/permissions.js';

const objectId = /^[0-9a-fA-F]{24}$/;

// ---------------------------
// Admin Login Schema
// ---------------------------
// modules/auth/auth.validation.js

export const adminLoginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(128, { message: 'Password too long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character (@$!%*?&)' }),
  }),
});
// ---------------------------
// Create Staff/Admin Schema (Super Admin only)
// ---------------------------
export const createAdminSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(3, { message: 'Name must be at least 3 characters long' })
      .max(50, { message: 'Name too long' }),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(128, { message: 'Password too long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character (@$!%*?&)' }),
    phone: z.string().min(10, { message: 'Phone is required' }), // <-- added
    role: z.enum(['Staff', 'Super Admin'], { required_error: 'Role is required' }),
    permissions: z.array(z.enum(ALL_PERMISSIONS)).optional(),
  })
});

export const updateStaffPermissionsSchema = z.object({
  params: z.object({
    id: z.string().regex(objectId, 'Invalid staff id'),
  }),
  body: z.object({
    permissions: z.array(z.enum(ALL_PERMISSIONS)),
  }),
});