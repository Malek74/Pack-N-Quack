import AvatarUploader from "@/components/shared/AvatarUploader";
import ImageUploader from "@/components/shared/ImageUploader";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ComponentTestPage() {
  const [imagesToUpload, setImagesToUpload] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  return (
    <div className="flex flex-col items-center justify-center">
      {/* <ImageUploader
        imagesUploaded={imagesToUpload}
        setImagesUploaded={setImagesToUpload}
        shouldHandleSave
      /> */}
      <AvatarUploader
        croppedImage={croppedImage}
        setCroppedImage={setCroppedImage}
        size={28}
      />
      <Button onClick={() => console.log(croppedImage)}>
        Print cropped image
      </Button>
    </div>
  );
}
