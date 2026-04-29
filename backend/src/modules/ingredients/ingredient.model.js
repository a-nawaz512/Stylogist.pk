import mongoose from "mongoose";

// Single FAQ entry — embedded so the storefront can render the Schema.org
// FAQPage JSON-LD inline without a join.
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Ingredient entity. Distinct from `Variant.ingredients` (which remains a
// free-text string for legacy / per-variant copy). This model represents a
// canonical taxonomy of ingredients that products can be tagged with —
// used for storefront filtering AND for SEO landing pages
// (/ingredient/:slug).
const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ingredient name is required"],
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      // Slug is the high-traffic lookup key (storefront filters, /ingredient/:slug
      // landing pages, sitemap generation). Index is implicit via `unique`,
      // but called out here as the dominant access pattern.
    },

    description: {
      type: String,
      default: "",
    },

    metaTitle: {
      type: String,
      trim: true,
      default: "",
      maxlength: 60,
    },

    metaDescription: {
      type: String,
      trim: true,
      default: "",
      maxlength: 160,
    },

    image: {
      type: String,
      default: null,
    },

    benefits: { type: [String], default: [] },
    uses: { type: [String], default: [] },
    faq: { type: [faqSchema], default: [] },

    // When false, the public ingredient page emits `<meta name="robots"
    // content="noindex">` — useful for ingredients we want to expose for
    // filtering but not have search engines index as standalone landing
    // pages (e.g. internal noise, generic stubs).
    isIndexable: { type: Boolean, default: true },

    // Soft-disable flag separate from indexability — admins can hide an
    // ingredient from filters/dropdowns without deleting it.
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Full-text search across the dominant SEO fields.
ingredientSchema.index({ name: "text", metaTitle: "text", metaDescription: "text" });

export const Ingredient = mongoose.model("Ingredient", ingredientSchema);
