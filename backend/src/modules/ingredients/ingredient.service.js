import mongoose from "mongoose";
import { Ingredient } from "./ingredient.model.js";
import { Product } from "../products/product.model.js";
import { ProductMedia } from "../products/media.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateUniqueSlug } from "../../utils/slug.js";

const cleanArray = (arr) =>
  Array.isArray(arr) ? arr.map((s) => (s || "").toString().trim()).filter(Boolean) : [];

const cleanFaq = (arr) =>
  Array.isArray(arr)
    ? arr
        .map((q) => ({
          question: (q?.question || "").toString().trim(),
          answer: (q?.answer || "").toString().trim(),
        }))
        .filter((q) => q.question && q.answer)
    : [];

export const listIngredients = async (query = {}) => {
  const { search = "", active, includeCount, page = 1, limit = 50 } = query;

  const filter = {};
  if (active === "true") filter.isActive = true;
  else if (active === "false") filter.isActive = false;
  if (search) filter.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };

  const pageNum = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 200);

  let [items, total] = await Promise.all([
    Ingredient.find(filter)
      .sort({ name: 1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Ingredient.countDocuments(filter),
  ]);

  if (includeCount === "true" && items.length) {
    // Single aggregation tagged with each ingredient id avoids the N+1 we'd
    // get by counting per-ingredient on the client. Multikey index on
    // `product.ingredients` keeps this O(matched rows).
    const ids = items.map((i) => i._id);
    const counts = await Product.aggregate([
      { $match: { ingredients: { $in: ids }, status: "published" } },
      { $unwind: "$ingredients" },
      { $match: { ingredients: { $in: ids } } },
      { $group: { _id: "$ingredients", count: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));
    items = items.map((i) => ({ ...i, productCount: map[i._id.toString()] || 0 }));
  }

  return {
    items,
    pagination: { page: pageNum, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
  };
};

export const getIngredientBySlug = async (slug) => {
  const ingredient = await Ingredient.findOne({ slug }).lean();
  if (!ingredient) throw new ApiError(404, "Ingredient not found");
  return ingredient;
};

export const getIngredientById = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid ingredient id");
  const ingredient = await Ingredient.findById(id).lean();
  if (!ingredient) throw new ApiError(404, "Ingredient not found");
  return ingredient;
};

export const createIngredient = async (data) => {
  const payload = { ...data };
  const slugSeed = (payload.slug && payload.slug.trim()) || payload.name;
  payload.slug = await generateUniqueSlug(Ingredient, slugSeed);
  payload.benefits = cleanArray(payload.benefits);
  payload.uses = cleanArray(payload.uses);
  payload.faq = cleanFaq(payload.faq);
  return Ingredient.create(payload);
};

export const updateIngredient = async (id, data) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid ingredient id");
  const ingredient = await Ingredient.findById(id);
  if (!ingredient) throw new ApiError(404, "Ingredient not found");

  const { slug: nextSlug, ...rest } = data;

  if (rest.name && rest.name !== ingredient.name && !nextSlug) {
    ingredient.slug = await generateUniqueSlug(Ingredient, rest.name, id);
  }
  if (nextSlug && nextSlug.trim() && nextSlug.trim() !== ingredient.slug) {
    ingredient.slug = await generateUniqueSlug(Ingredient, nextSlug.trim(), id);
  }

  if (rest.name !== undefined) ingredient.name = rest.name;
  if (rest.description !== undefined) ingredient.description = rest.description;
  if (rest.metaTitle !== undefined) ingredient.metaTitle = rest.metaTitle;
  if (rest.metaDescription !== undefined) ingredient.metaDescription = rest.metaDescription;
  if (rest.image !== undefined) ingredient.image = rest.image || null;
  if (Array.isArray(rest.benefits)) ingredient.benefits = cleanArray(rest.benefits);
  if (Array.isArray(rest.uses)) ingredient.uses = cleanArray(rest.uses);
  if (Array.isArray(rest.faq)) ingredient.faq = cleanFaq(rest.faq);
  if (rest.isIndexable !== undefined) ingredient.isIndexable = rest.isIndexable;
  if (rest.isActive !== undefined) ingredient.isActive = rest.isActive;

  await ingredient.save();
  return ingredient.toObject();
};

export const deleteIngredient = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid ingredient id");
  const ingredient = await Ingredient.findById(id);
  if (!ingredient) throw new ApiError(404, "Ingredient not found");

  // Don't orphan products. Remove the reference from every product that
  // had this ingredient — single multikey-indexed updateMany.
  await Product.updateMany(
    { ingredients: ingredient._id },
    { $pull: { ingredients: ingredient._id } }
  );
  await ingredient.deleteOne();
  return { id };
};

// Storefront: paginated products tagged with this ingredient. Supports
// AND/OR logic when the caller passes additional ingredient slugs (used by
// the multi-select filter on the category page).
export const getProductsByIngredient = async (slug, query = {}) => {
  const ingredient = await Ingredient.findOne({ slug }).lean();
  if (!ingredient) throw new ApiError(404, "Ingredient not found");

  const {
    page = 1,
    limit = 24,
    sort,
    additionalSlugs = "",
    logic = "or",
  } = query;

  const extraSlugs = additionalSlugs
    .toString()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const slugSet = [...new Set([slug, ...extraSlugs])];
  const ingredients = await Ingredient.find({ slug: { $in: slugSet } }).select("_id").lean();
  const ingredientIds = ingredients.map((i) => i._id);

  // AND logic: product must contain ALL selected ingredient ids.
  // OR logic: product must contain at least ONE.
  const ingredientFilter =
    logic === "and"
      ? { ingredients: { $all: ingredientIds } }
      : { ingredients: { $in: ingredientIds } };

  const filter = { status: "published", ...ingredientFilter };

  const sortMap = {
    priceLow: { minPrice: 1 },
    priceHigh: { minPrice: -1 },
    newest: { createdAt: -1 },
    rating: { averageRating: -1 },
    bestSelling: { totalSales: -1 },
  };
  const sortSpec = sort && sortMap[sort] ? sortMap[sort] : { createdAt: -1 };

  const pageNum = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);

  const LIST_PROJECTION =
    "name slug category brand status averageRating minPrice maxPrice totalStock discountPercentage totalReviews totalSales createdAt";

  const [items, total] = await Promise.all([
    Product.find(filter)
      .select(LIST_PROJECTION)
      .sort(sortSpec)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .lean(),
    Product.countDocuments(filter),
  ]);

  // Single fan-out for thumbnails, same pattern as /products list — avoids
  // N+1 and keeps the response tight.
  if (items.length) {
    const ids = items.map((p) => p._id);
    const mediaRows = await ProductMedia.aggregate([
      { $match: { product: { $in: ids }, type: "image" } },
      { $sort: { isThumbnail: -1, position: 1, createdAt: 1 } },
      { $group: { _id: "$product", url: { $first: "$url" } } },
    ]);
    const byProduct = new Map(mediaRows.map((m) => [m._id.toString(), m.url]));
    items.forEach((p) => {
      p.image = byProduct.get(p._id.toString()) || null;
    });
  }

  return {
    ingredient,
    items,
    pagination: { page: pageNum, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
  };
};
