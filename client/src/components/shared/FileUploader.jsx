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

FileUploader.propTypes = {
  filesUploaded: PropTypes.array,
  setFilesUploaded: PropTypes.func,
};

export default function FileUploader({ filesUploaded, setFilesUploaded }) {
  const { toast } = useToast();

  const documentFileSchema = z.object({
    type: z
      .string()
      .refine(
        (type) =>
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
          ].includes(type),
        {
          message: "Only document files are allowed (PDF, DOC, DOCX, TXT).",
        }
      ),
  });

  const handleDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    const validationResults = acceptedFiles.map((file) =>
      documentFileSchema.safeParse(file)
    );

    const invalidFiles = validationResults.filter((result) => !result.success);

    if (invalidFiles.length > 0) {
      toast({
        description: "Please only upload image files.",
        variant: "destructive",
      });
    } else {
      setFilesUploaded([...filesUploaded, ...acceptedFiles]);
      toast({
        description: `All your quacks are packed! ${acceptedFiles.length} pictures uploaded successfully!`,
        variant: "success",
      });
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
            <Input
              {...getInputProps()}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
            />
            <p className="text-center italic text-neutral-500">
              Drag and quack your documents here,
              <br />
              or click to pack them in!
            </p>
          </div>
          {filesUploaded.length > 0 && (
            <Carousel
              className="w-full max-w-xs"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {filesUploaded.map((file, index) => (
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
                              Quack Goodbye to This Image?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to quack this image goodbye?
                              Once it’s gone, it won’t waddle back!
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => {
                                setFilesUploaded(
                                  filesUploaded.filter((_, i) => i !== index)
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
                        src={file.type}
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
        </div>
      )}
    </Dropzone>
  );
}
