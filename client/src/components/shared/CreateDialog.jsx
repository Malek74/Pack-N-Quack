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
export default function CreateDialog({ title="", form, changePassword=false }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-gold hover:bg-goldhover text-white hover:text-white h-8 gap-1"
          variant="outline"
          size="sm"
        >
          {!changePassword && <PlusCircle className="h-3.5 w-3.5" />}
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
           {!changePassword ?  `Add ${title}`: "Change Password"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className=" max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a new {title}</DialogTitle>
          <DialogDescription>
            Add a new {title}. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
