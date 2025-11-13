import GalleryManagement from "../../../../components/admin/GalleryManagement";
import { ProtectedRoute } from "../../../../contexts/ProtectedRoute";

export default function GalleryManagementPage() {
  return (
    <ProtectedRoute>
      <GalleryManagement />
    </ProtectedRoute>
  );
}
