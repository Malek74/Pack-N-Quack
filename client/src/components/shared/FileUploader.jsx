import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileX2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

FileUploader.propTypes = {
  filesUploaded: PropTypes.array,
  fileToUpload: PropTypes.string,
  setFilesUploaded: PropTypes.func,
};

export default function FileUploader({
  filesUploaded,
  setFilesUploaded,
  fileToUpload,
}) {
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
        description: "Please only upload document files.",
        variant: "destructive",
      });
    } else {
      setFilesUploaded([...filesUploaded, ...acceptedFiles]);
      toast({
        description: `All your quacks are packed! ${acceptedFiles.length} documents uploaded successfully!`,
        variant: "success",
      });
    }
  };
  const getFileIcon = (fileExtension) => {
    switch (fileExtension) {
      case "pdf":
        return (
          <FileText
            absoluteStrokeWidth={true}
            size={88}
            className="text-red-500"
          />
        ); // You can replace FileCheck2 with another relevant icon
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <FileImage
            absoluteStrokeWidth={true}
            size={88}
            className="text-blue-500"
          />
        );
      case "doc":
      case "docx":
        return (
          <FileText
            absoluteStrokeWidth={true}
            size={88}
            className="text-blue-700"
          />
        );
      case "mp4":
      case "mkv":
        return (
          <FileVideo
            absoluteStrokeWidth={true}
            size={88}
            className="text-green-500"
          />
        );
      case "mp3":
      case "wav":
        return (
          <FileAudio
            absoluteStrokeWidth={true}
            size={88}
            className="text-purple-500"
          />
        );
      default:
        return (
          <FileText
            absoluteStrokeWidth={true}
            size={88}
            className="text-neutral-700"
          />
        );
    }
  };

  return (
    <Dropzone multiple={false} onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex w-full items-center justify-between gap-4">
            {filesUploaded.length == 0 ? (
              <div
                {...getRootProps()}
                className="flex flex-col items-center justify-center border-2 border-dashed p-8 hover:cursor-pointer hover:bg-slate-50"
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
            ) : (
              filesUploaded.map((file, index) => (
                <div
                  key={index}
                  className="flex h-[200px] w-[250px] basis-1/2 items-center justify-center"
                >
                  <div className="relative h-full w-full overflow-hidden p-1">
                    <AlertDialog>
                      <AlertDialogTrigger className="absolute right-1 top-1">
                        <FileX2 className="absolute right-1 top-1 rounded-lg bg-neutral-900 p-1 text-red-500 hover:cursor-pointer hover:bg-neutral-800" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete this document?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this document? Once
                            deleted, it cannot be recovered.
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
                                description: `The document has waddled off successfully!`,
                              });
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-4">
                        {getFileIcon(file.name.split(".").pop().toLowerCase())}
                        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
                          {file.name}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </Dropzone>
  );
}
