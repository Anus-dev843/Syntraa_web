import { notFound } from "next/navigation";

import { AdminEditProductForm } from "@/components/admin/AdminEditProductForm";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { isMongoConfigured } from "@/lib/mongo-uri";
import { getProductById } from "@/lib/product-service";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }
  return (
    <AdminEditProductForm
      product={product}
      mongoConfigured={isMongoConfigured()}
      cloudConfigured={isCloudinaryConfigured()}
    />
  );
}
