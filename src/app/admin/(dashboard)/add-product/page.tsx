import { AdminAddProductForm } from "@/components/admin/AdminAddProductForm";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { isMongoConfigured } from "@/lib/mongo-uri";

export default function AdminAddProductPage() {
  return (
    <AdminAddProductForm
      mongoConfigured={isMongoConfigured()}
      cloudConfigured={isCloudinaryConfigured()}
    />
  );
}
