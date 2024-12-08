import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BellPlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import PropTypes from "prop-types";

ClosedBookingActivity.propTypes = {
  activityID: PropTypes.string,
  userID: PropTypes.string,
};

export default function ClosedBookingActivity({ activityID }) {
  const notify = async () => {
    console.log("notifying me");
    console.log(activityID);
    try {
      await axios.post(`/api/activity/notifyMe/${activityID}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <BellPlus />
              </TooltipTrigger>
              <TooltipContent>
                <p>Notify when the booking opens</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Notified</DialogTitle>
          <DialogDescription>
            If you want to get notified when booking opens click the button
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={() => notify()}>
            Notify Me
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
