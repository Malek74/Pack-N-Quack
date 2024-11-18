import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PropTypes from "prop-types";

PdfViewerDialog.propTypes = {
  src: PropTypes.string,
};

export default function PdfViewerDialog({ src }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View PDF</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>PDF Viewer</DialogTitle>
          <DialogDescription>
            View the PDF document in this dialog window.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 h-[60vh]">
          <iframe
            src={src}
            className="w-full h-full border-none"
            title="PDF Viewer"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
