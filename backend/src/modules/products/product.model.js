import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    title: String,

    description: {
      type: String,
      required: true,
    },

    shortDescription: String,

    metaTitle: {
      type: String,
      trim: true,
      default: "",
    },

    metaDescription: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    // Multi-select: a product can live in several categories/sub-categories
    // at once. `category` above is kept as the primary (first selected) so
    // existing queries that filter on `category` continue to work.
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        index: true,
      },
    ],

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    dealStart: Date,
    dealEnd: Date,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    minPrice: {
      type: Number,
      index: true,
    },

    maxPrice: {
      type: Number,
    },

    totalStock: {
      type: Number,
      default: 0,
      index: true,
    },

    discountPercentage: {
      type: Number,
      default: 0,
      index: true,
    },

    isDealActive: {
      type: Boolean,
      default: false,
      index: true,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalSales: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", metaTitle: "text", metaDescription: "text" });

export const Product = mongoose.model("Product", productSchema);
