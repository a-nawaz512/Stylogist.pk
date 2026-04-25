import { z } from "zod";

const objectId = /^[0-9a-fA-F]{24}$/;

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Brand name must be at least 2 characters").trim(),
    description: z.string().trim().optional(),
    metaTitle: z.string().trim().max(60, "Meta title must be 60 characters or fewer").optional(),
    metaDescription: z.string().trim().max(160, "Meta description must be 160 characters or fewer").optional(),
    slug: z.string().trim().min(1).optional(),
    logo: z.string().url("Logo must be a valid URL").optional().or(z.literal("")).nullable(),
    website: z.string().url("Website must be a valid URL").optional().or(z.literal("")),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateBrandSchema = z.object({
  params: z.object({
    id: z.string().regex(objectId, "Invalid brand id"),
  }),
  body: z.object({
    name: z.string().min(2).trim().optional(),
    description: z.string().trim().optional(),
    metaTitle: z.string().trim().max(60).optional(),
    metaDescription: z.string().trim().max(160).optional(),
    slug: z.string().trim().min(1).optional(),
    logo: z.string().url().optional().or(z.literal("")).nullable(),
    website: z.string().url().optional().or(z.literal("")),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const brandIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectId, "Invalid brand id"),
  }),
});
