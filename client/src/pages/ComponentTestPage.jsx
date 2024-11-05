import AvatarUploader from "@/components/shared/AvatarUploader";
import ImageUploader from "@/components/shared/ImageUploader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FileUploader from "@/components/shared/FileUploader";

export default function ComponentTestPage() {
  const [imagesToUpload, setImagesToUpload] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  // const [croppedImage, setCroppedImage] = useState(null);
  return (
    <div className="flex flex-col items-center justify-center">
      <FileUploader
        filesUploaded={filesToUpload}
        setFilesUploaded={setFilesToUpload}
      />
      {/* <AvatarUploader
        croppedImage={croppedImage}
        setCroppedImage={setCroppedImage}
        size={28}
      /> */}
    </div>
  );
}
