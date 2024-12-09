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
import { useUser } from "@/context/UserContext";
AvatarUploader.propTypes = {
  userId: PropTypes.string,
  croppedImage: PropTypes.instanceOf(File),
  setCroppedImage: PropTypes.func,
  croppedImageUrl: PropTypes.string,
};

export default function AvatarUploader({
  croppedImage,
  setCroppedImage,
  croppedImageUrl,
}) {
  const divClassName = `flex aspect-square w-20 flex-col items-center justify-center rounded-full border-2 hover:cursor-pointer hover:bg-slate-50`;
  const imgClassName = `rounded-full object-cover`;

  const { toast } = useToast();
  const [avatarUploaded, setAvatarUploaded] = useState(null); // Use URL for preview
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const { userType } = useUser();
  const user = (userType) => {
    switch (userType) {
      case "Admin":
        return "admins";

      case "Advertiser":
        return "advertisers";

      case "Seller":
        return "sellers";

      case "Tourist":
        return "tourist";

      case "Tour Guide":
        return "tourGuide";
    }
  };
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
      handleApiCall(croppedImageFile);
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

  const handleApiCall = async (croppedImageFile) => {
    try {
      const formData = new FormData();
      formData.append("images", croppedImageFile); // Now `croppedImage` is a File
      formData.append("userType", user(userType));
      console.log(croppedImage);
      await axios.post(`/api/upload/images`, formData);
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
          <DialogContent className="h-auto w-full max-w-lg">
            <DialogTitle>Crop your avatar</DialogTitle>
            <div className="relative h-64 w-full bg-gray-200">
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
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={() => setIsCropping(false)}>Cancel</Button>
              <Button onClick={handleCropSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* <Button type="button" onClick={() => handleApiCall()}>
        Upload Avatar
      </Button> */}
    </div>
  );
}
