import { Router } from "express";
import * as BrandController from "./brand.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { restrictTo, hasPermission } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  createBrandSchema,
  updateBrandSchema,
  brandIdParamSchema,
} from "./brand.validation.js";

const router = Router();

const adminWrite = [
  authMiddleware,
  restrictTo("Super Admin", "Staff"),
  hasPermission("brands:write"),
];

// Public reads
router.get("/", catchAsync(BrandController.listBrands));
router.get("/:id", validate(brandIdParamSchema), catchAsync(BrandController.getBrand));

// Admin writes
router.post("/", ...adminWrite, validate(createBrandSchema), catchAsync(BrandController.createBrand));
router.patch("/:id", ...adminWrite, validate(updateBrandSchema), catchAsync(BrandController.updateBrand));
router.delete("/:id", ...adminWrite, validate(brandIdParamSchema), catchAsync(BrandController.deleteBrand));

export default router;
