import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
    },

    // size doubles as the customer-facing label ("Small", "30 capsules").
    // packSize captures the numeric quantity so we can sort/filter on it.
    size: String,
    packSize: { type: String, trim: true, default: "" },
    color: String,

    // Renamed from `material` to `ingredients` for the supplements/wellness
    // catalogue. Legacy data is migrated lazily by the virtual below — old
    // documents with a `material` field still surface via `variant.ingredients`.
    ingredients: { type: String, trim: true, default: "" },

    originalPrice: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      required: true,
    },

    discountPercentage: Number,

    stock: {
      type: Number,
      required: true,
    },

    weight: Number,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Backwards compatibility: existing documents written with `material` should
// still respond to reads on `ingredients`. The virtual unifies the two so
// callers can migrate at their own pace.
variantSchema.virtual("ingredientsResolved").get(function () {
  return this.ingredients || this.get("material") || "";
});

export const Variant = mongoose.model("Variant", variantSchema);
