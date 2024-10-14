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

AvatarUploader.propTypes = {
  size: PropTypes.number,
};

export default function AvatarUploader({ size = 28 }) {
  const { toast } = useToast();
  const [avatarUploaded, setAvatarUploaded] = useState(null); // Use URL for preview
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null); // To store the final cropped image
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
      const croppedImageUrl = await getCroppedImg(
        avatarUploaded,
        croppedAreaPixels
      ); // Get the cropped image as a data URL or blob
      setCroppedImage(croppedImageUrl); // Store the cropped image
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
            className={`border-2 aspect-square flex flex-col items-center justify-center rounded-full w-${size} hover:cursor-pointer hover:bg-slate-50`}
          >
            <Input {...getInputProps()} type="file" />
            {croppedImage ? (
              <img
                src={croppedImage}
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
    </div>
  );
}
