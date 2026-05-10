import mongoose, { Schema, type InferSchemaType } from "mongoose";

const cmsPageSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { _id: false },
);

const adminCmsSchema = new Schema(
  {
    _id: { type: String, required: true },
    pages: { type: [cmsPageSchema], default: [] },
  },
  { versionKey: false },
);

export type AdminCmsDocument = InferSchemaType<typeof adminCmsSchema> & {
  _id: string;
};

export const ADMIN_CMS_DOC_ID = "syntraa_cms_pages";

export const AdminCmsModel =
  (mongoose.models.AdminCms as mongoose.Model<AdminCmsDocument>) ||
  mongoose.model<AdminCmsDocument>("AdminCms", adminCmsSchema);
