import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
export default function EditDialog({ title, form }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-gold hover:bg-goldhover text-white hover:text-white h-8 gap-1"
          variant="outline"
          size="sm"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Edit {title}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change {title}</DialogTitle>
          <DialogDescription>
            Edit a {title}. Click edit when you're done.
          </DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
