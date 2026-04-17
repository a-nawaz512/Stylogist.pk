import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },

        url: {
            type: String,
            required: true,
        },

        filename: {
            type: String,
            default: "",
        },

        slug: {
            type: String,
            default: "",
            index: true,
        },

        metaTitle: {
            type: String,
            default: "",
        },

        metaDescription: {
            type: String,
            default: "",
        },

        alt: {
            type: String,
            default: "",
        },

        isThumbnail: {
            type: Boolean,
            default: false,
            index: true,
        },

        type: {
            type: String,
            enum: ["image", "video"],
            default: "image",
        },

        position: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const ProductMedia = mongoose.model("ProductMedia", mediaSchema);
