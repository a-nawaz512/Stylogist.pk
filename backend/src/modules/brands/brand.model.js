import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // SEO copy for the public /brand/:slug page. metaTitle/metaDescription
    // also feed the sitemap and JSON-LD Brand schema.
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
    logo: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
