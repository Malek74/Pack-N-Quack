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
  userType: PropTypes.string,
  userId: PropTypes.string,
  croppedImage: PropTypes.instanceOf(File),
  setCroppedImage: PropTypes.func,
  croppedImageUrl: PropTypes.string,
};

// TODO: Add naming like image uploaded
// TODO: get userType and userId dynamically
// TODO: Add avatar viewing
export default function AvatarUploader({
  size = 28,
  userType,
  userId,
  croppedImage,
  setCroppedImage,
  croppedImageUrl,
}) {
  const divClassName = `border-2 aspect-square flex flex-col items-center justify-center rounded-full hover:cursor-pointer hover:bg-slate-50 w-${size}`;
  const imgClassName = `rounded-full object-cover max-w-${size}`;

  const { toast } = useToast();
  const [avatarUploaded, setAvatarUploaded] = useState(null); // Use URL for preview
  const [isCropping, setIsCropping] = useState(false);
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
      console.log("Updated", croppedImageFile); // Create and store the URL for display
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
      formData.append("userType", userType);
      console.log(croppedImage);
      await axios.post(`/api/upload/images/${userId}`, formData);
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

  return (
    <div>
      <Dropzone
        noDrag={true}
        onDrop={handleDrop}
        multiple={false}
        accept="image/*"
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className={divClassName}>
            <Input {...getInputProps()} type="file" accept="image/*" />
            {croppedImage ? (
              <img
                src={URL.createObjectURL(croppedImage)}
                alt="Cropped Avatar"
                width={112.5}
                height={112.5}
                className={imgClassName}
              />
            ) : croppedImageUrl ? (
              <img
                src={croppedImageUrl}
                alt="Cropped Avatar"
                width={112.5}
                height={112.5}
                className={imgClassName}
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
      <Button type="button" onClick={() => handleApiCall()}>
        Upload Avatar
      </Button>
    </div>
  );
}
