import Dropzone from "react-dropzone";
import { Input } from "../ui/input";
import PropTypes from "prop-types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import getCroppedImg from "@/utilities/getCroppedImg"; // Helper function to get cropped image
import axios from "axios";

AvatarUploader.propTypes = {
  size: PropTypes.number,
};

// TODO: Add naming like image uploaded
// TODO: get userType and userId dynamically
// TODO: Add avatar viewing
export default function AvatarUploader({ size = 28 }) {
  const { toast } = useToast();
  const [avatarUploaded, setAvatarUploaded] = useState(null); // Use URL for preview
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null); // To store the final cropped image
  const [croppedImageUrl, setCroppedImageUrl] = useState(null); // URL for display
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const imageFileSchema = z.object({
    type: z.string().refine((type) => type.startsWith("image/"), {
      message: "Only image files are allowed.",
    }),
  });

  const handleDrop = (acceptedFiles) => {
    const acceptedFile = acceptedFiles[0];
    const validationResult = imageFileSchema.safeParse(acceptedFile);

    if (!validationResult.success) {
      toast({
        description: "Please only upload image files.",
        variant: "destructive",
      });
    } else {
      const fileURL = URL.createObjectURL(acceptedFile);
      setAvatarUploaded(fileURL); // Set the image URL for cropping
      setIsCropping(true); // Open cropping modal
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels); // Store cropped area
  };

  const handleCropSave = async () => {
    try {
      const croppedImageFile = await getCroppedImg(
        avatarUploaded,
        croppedAreaPixels
      );
      setCroppedImage(croppedImageFile); // Store the File for upload
      setCroppedImageUrl(URL.createObjectURL(croppedImageFile)); // Create and store the URL for display
      toast({
        description: "Cropped avatar saved successfully!",
        variant: "success",
      });
      setIsCropping(false); // Close modal after saving
    } catch (e) {
      toast({
        description: "Something went wrong while cropping the image.",
        variant: "destructive",
      });
      console.error(e);
    }
  };

  const handleApiCall = async () => {
    try {
      const formData = new FormData();
      formData.append("images", croppedImage); // Now `croppedImage` is a File
      formData.append("userType", "tourGuide");
      formData.append("userId", "66fb241366ea8f57d59ec6db");

      await axios.post("/api/upload/images", formData);
      toast({
        description: "Avatar uploaded successfully!",
        variant: "success",
      });
    } catch (e) {
      toast({
        description: "Something went wrong while uploading the avatar.",
        variant: "destructive",
      });
      console.error(e);
    }
  };
  const handleApiCall2 = async () => {
    try {
      const response = await axios.post("/api/upload/fetchImages", {
        userType: "tourGuide",
        userId: "66fb241366ea8f57d59ec6db",
      });

      console.log(response.data);
      setCroppedImageUrl(response.data.image);
      toast({
        description: "Avatar Downloaded successfully!",
        variant: "success",
      });
    } catch (e) {
      toast({
        description: "Something went wrong while getting the avatar.",
        variant: "destructive",
      });
      console.error(e);
    }
  };
  return (
    <div>
      <Dropzone
        noDrag={true}
        onDrop={handleDrop}
        multiple={false}
        accept="image/*"
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={`border-2 aspect-square flex flex-col items-center justify-center rounded-full w-28 hover:cursor-pointer hover:bg-slate-50`}
          >
            <Input {...getInputProps()} type="file" />
            {croppedImageUrl ? (
              <img
                src={croppedImageUrl}
                alt="Cropped Avatar"
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <p className="text-center italic text-neutral-500">
                Upload
                <br /> Avatar
              </p>
            )}
          </div>
        )}
      </Dropzone>

      {/* Cropping Modal */}
      {isCropping && (
        <Dialog open={isCropping} onOpenChange={setIsCropping}>
          <DialogContent className="w-full h-auto max-w-lg">
            <DialogTitle>Crop your avatar</DialogTitle>
            <div className="relative w-full h-64 bg-gray-200">
              {avatarUploaded && (
                <Cropper
                  image={avatarUploaded}
                  cropShape="round"
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  showGrid={false}
                  restrictPosition={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  zoomSpeed={0.3}
                  onZoomChange={setZoom}
                />
              )}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button onClick={() => setIsCropping(false)}>Cancel</Button>
              <Button onClick={handleCropSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Button onClick={() => handleApiCall2()}>Print cropped image</Button>
    </div>
  );
}
