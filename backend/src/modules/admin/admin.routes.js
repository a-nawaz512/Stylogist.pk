import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { restrictTo } from '../../middlewares/role.middleware.js';
import { adminLoginSchema, createAdminSchema } from './admin.validation.js';
import { catchAsync } from '../../utils/catchAsync.js';

const router = Router();

// Public route: admin login
router.post('/login', validate(adminLoginSchema), catchAsync(adminController.adminLogin));

// Protected routes: all below require login
router.use(authMiddleware);

// Logout route
router.post('/logout', catchAsync(adminController.adminLogout));

// Dashboard: accessible by Staff and Super Admin
// router.get('/dashboard', restrictTo('Staff'), catchAsync(async (req, res) => {
//   res.json({ message: `Welcome ${req.user.role} to admin dashboard` });
// }));

// Super Admin creates new Staff/Admin
router.post(
  '/create-admin',
  restrictTo('Super Admin' || "Staff"),
  validate(createAdminSchema),
  catchAsync(adminController.createAdmin)
);

export default router;