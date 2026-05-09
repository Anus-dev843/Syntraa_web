import mongoose, { Schema, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    image: { type: String, required: true, trim: true },
    /** Extra gallery images (excludes primary `image`). Max 7 enforced in service. */
    images: { type: [String], default: [] },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    featured: { type: Boolean, default: false },
    currency: { type: String, default: "USD", trim: true },
    shortDescription: { type: String, default: "", trim: true },
    ingredients: { type: [String], default: [] },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<ProductDocument>) ||
  mongoose.model<ProductDocument>("Product", productSchema);
