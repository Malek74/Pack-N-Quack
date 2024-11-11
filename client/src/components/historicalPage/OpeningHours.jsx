/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function OpeningHours(props) {
  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()}>
        <Label className="w-min text-black hover:text-gray-500 underline">
          Click for Opening Hours
        </Label>
      </DialogTrigger>
      <DialogContent>
        {Array.isArray(props.openingHours) &&
          props.openingHours.map((opening, index) => (
            <div key={index}>
              <p>
                <b>{opening.day}</b>{" "}
                {opening.isOpen ? (
                  <span>{`${opening.openTime} - ${opening.closeTime}`} </span>
                ) : (
                  <span>Closed</span>
                )}{" "}
              </p>
            </div>
          ))}

        <DialogFooter>
          <DialogClose onClick={(e) => e.stopPropagation()}>
            <Button type="close" className="w-min bg-gold hover:bg-goldhover">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
