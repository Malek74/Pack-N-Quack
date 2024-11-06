/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function RateComment({ title, form }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-gold hover:bg-goldhover text-white hover:text-white h-8 gap-1"
          variant="outline"
          size="sm"
        >
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Rate {title}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rate {title}</DialogTitle>
          <DialogDescription>
            Let us know your opinion about {title}. Click submit when you are
            done.
          </DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
