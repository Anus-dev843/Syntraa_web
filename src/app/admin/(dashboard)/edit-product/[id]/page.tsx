import { notFound } from "next/navigation";

import { AdminEditProductForm } from "@/components/admin/AdminEditProductForm";
import { getProductById } from "@/lib/product-service";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }
  return <AdminEditProductForm product={product} />;
}
