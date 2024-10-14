import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ImageMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import axios from "axios";
import { Button } from "../ui/button";
import Loading from "./Loading";
import { useState } from "react";

ImageUploader.propTypes = {
  imagesUploaded: PropTypes.array.isRequired,
  setImagesUploaded: PropTypes.func.isRequired,
  shouldHandleSave: PropTypes.bool,
  apiEndpoint: PropTypes.string,
};

ImageUploader.propTypes = {
  apiEndpoint: (props) => {
    if (props.shouldHandleSave === true && !props.apiEndpoint) {
      return new Error(
        `When 'shouldHandleSave' is true, 'apiEndpoint' is required.`
      );
    }
  },
};

export default function ImageUploader({
  imagesUploaded,
  setImagesUploaded,
  shouldHandleSave = false,
  apiEndpoint = "",
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const imageFileSchema = z.object({
    type: z.string().refine((type) => type.startsWith("image/"), {
      message: "Only image files are allowed.",
    }),
  });

  const handleDrop = (acceptedFiles) => {
    const validationResults = acceptedFiles.map((file) =>
      imageFileSchema.safeParse(file)
    );

    const invalidFiles = validationResults.filter((result) => !result.success);

    if (invalidFiles.length > 0) {
      toast({
        description: "Please only upload image files.",
        variant: "destructive",
      });
    } else {
      setImagesUploaded([...imagesUploaded, ...acceptedFiles]);
      toast({
        description: `All your quacks are packed! ${acceptedFiles.length} pictures uploaded successfully!`,
        variant: "success",
      });
    }
  };

  const handleSave = async () => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      // Append each uploaded image to the FormData object
      imagesUploaded.forEach((image) => {
        formData.append(`images`, image); // You can name the files based on index or just 'image'
      });

      setIsLoading(true);
      // Send the FormData object via axios
      // const response = await axios.post(apiEndpoint, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data", // Make sure to set this header
      //   },
      // });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast({
        description: `All your quacks are packed! ${imagesUploaded.length} pictures uploaded successfully!`,
        variant: "success",
      });
      setIsLoading(false);
      setImagesUploaded([]);

      // console.log(response);
    } catch (error) {
      toast({
        description: "Something went wrong. The images were not uploaded.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div className="flex flex-col gap-4 justify-center items-center">
          <div
            {...getRootProps()}
            className="border-dashed border-2 p-8 flex flex-col items-center justify-center hover:cursor-pointer hover:bg-slate-50"
          >
            <Input {...getInputProps()} type="file" accept="image/*" />
            <p className="text-center italic text-neutral-500">
              Drag and quack your pics here,
              <br />
              or click to pack them in!
            </p>
          </div>
          {imagesUploaded.length > 0 && !isLoading && (
            <Carousel
              className="w-full max-w-xs"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {imagesUploaded.map((file, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/2 w-[250px] h-[200px] flex justify-center items-center"
                  >
                    <div className="p-1 relative w-full h-full overflow-hidden">
                      <AlertDialog>
                        <AlertDialogTrigger className="absolute top-1 right-1">
                          <ImageMinus className="absolute top-1 right-1 bg-neutral-900 text-red-500 p-1 hover:cursor-pointer hover:bg-neutral-800 rounded-lg" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this image?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this image? Once
                              deleted, it cannot be recovered.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => {
                                setImagesUploaded(
                                  imagesUploaded.filter((_, i) => i !== index)
                                );
                                toast({
                                  description: `The image has waddled off successfully!`,
                                });
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <img
                        src={URL.createObjectURL(file)}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
          {imagesUploaded.length > 0 && shouldHandleSave && !isLoading && (
            <Button
              className="bg-gold hover:bg-goldhover place-self-end"
              onClick={handleSave}
            >
              Pack Them Quack!
            </Button>
          )}
          {isLoading && <Loading />}
        </div>
      )}
    </Dropzone>
  );
}
