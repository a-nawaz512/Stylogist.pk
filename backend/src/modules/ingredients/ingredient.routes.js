import { Router } from "express";
import * as IngredientController from "./ingredient.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { restrictTo, hasPermission } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  createIngredientSchema,
  updateIngredientSchema,
  ingredientIdParamSchema,
  ingredientSlugParamSchema,
} from "./ingredient.validation.js";

const router = Router();

const adminWrite = [
  authMiddleware,
  restrictTo("Super Admin", "Staff"),
  hasPermission("ingredients:write"),
];

// Public reads — list, detail by slug, products tagged with ingredient.
router.get("/", catchAsync(IngredientController.listIngredients));
router.get(
  "/:slug/products",
  validate(ingredientSlugParamSchema),
  catchAsync(IngredientController.getProductsByIngredient)
);
router.get(
  "/id/:id",
  validate(ingredientIdParamSchema),
  catchAsync(IngredientController.getIngredientById)
);
router.get(
  "/:slug",
  validate(ingredientSlugParamSchema),
  catchAsync(IngredientController.getIngredient)
);

// Admin writes — gated by the new `ingredients:write` permission.
router.post(
  "/",
  ...adminWrite,
  validate(createIngredientSchema),
  catchAsync(IngredientController.createIngredient)
);
router.patch(
  "/:id",
  ...adminWrite,
  validate(updateIngredientSchema),
  catchAsync(IngredientController.updateIngredient)
);
router.delete(
  "/:id",
  ...adminWrite,
  validate(ingredientIdParamSchema),
  catchAsync(IngredientController.deleteIngredient)
);

export default router;
