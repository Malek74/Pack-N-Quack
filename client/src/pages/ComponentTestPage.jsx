// import AvatarUploader from "@/components/shared/AvatarUploader";
// import ImageUploader from "@/components/shared/ImageUploader";
// import { Button } from "@/components/ui/button";
import { useState } from "react";
import FileUploader from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/button";
import axios from "axios";
export default function ComponentTestPage() {
  // const [imagesToUpload, setImagesToUpload] = useState([]);
  const [filesUploaded, setFilesToUpload] = useState([]);
  // const [croppedImage, setCroppedImage] = useState(null);

  const handleApiCall = async () => {
    const formData = new FormData();
    formData.append("documentNames", "ID");
    formData.append("documentNames", "");
    formData.append("documents", filesUploaded[0]);
    formData.append("userType", "tourGuide");
    formData.append("userId", "66fb241366ea8f57d59ec6db");
    console.log(filesUploaded[0]);
    try {
      const response = await axios.post("/api/upload/documents", formData);

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <FileUploader
        filesUploaded={filesUploaded}
        setFilesUploaded={setFilesToUpload}
        fileToUpload={"ID"}
      />
      <Button onClick={() => handleApiCall()}>Upload</Button>
      <iframe
        src="https://res.cloudinary.com/dz3l4ah26/raw/upload/v1730838450/Winter2024MidTermScheduleAll1.pdf"
        height={"600px"}
        width={"100%"}
      />
      {/* <AvatarUploader
        croppedImage={croppedImage}
        setCroppedImage={setCroppedImage}
        size={28}
      /> */}
    </div>
  );
}
