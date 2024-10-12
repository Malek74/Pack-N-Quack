import { useState } from "react";
import ImageUploader from "@/components/shared/ImageUploader";
export default function ComponentTestPage() {
  const [imagesUploaded, setImagesUploaded] = useState([]);

  return (
    <div>
      <ImageUploader
        imagesUploaded={imagesUploaded}
        setImagesUploaded={setImagesUploaded}
        shouldHandleSave
        apiEndpoint="/api/upload"
      />
    </div>
  );
}
