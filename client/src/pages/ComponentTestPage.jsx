import { useState } from "react";
import ImageUploader from "@/components/shared/ImageUploader";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function ComponentTestPage() {
  const [imagesUploaded, setImagesUploaded] = useState([]);

  const handleSave = async () => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      // Append each uploaded image to the FormData object
      imagesUploaded.forEach((image) => {
        formData.append(`images`, image); // You can name the files based on index or just 'image'
      });

      // Send the FormData object via axios
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure to set this header
        },
      });

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ImageUploader
        imagesUploaded={imagesUploaded}
        setImagesUploaded={setImagesUploaded}
      />
      <Button className="mt-4" onClick={handleSave}>
        Save Images
      </Button>
    </div>
  );
}
