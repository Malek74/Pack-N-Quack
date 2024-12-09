import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BookItineraryForm from "@/components/ItinerariesPage/BookItineraryForm";
import PropTypes from "prop-types";
import { DialogContent } from "@mui/material";

BookItinerary.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  available_dates: PropTypes.array,
  price: PropTypes.number,
};

export default function BookItinerary({ name, id, available_dates, price }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Book Itinerary</Button>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle>Book {name}?</DialogTitle>
        <DialogDescription>Please fill out the booking form!</DialogDescription>
      </DialogHeader>
      <DialogContent>
        <BookItineraryForm
          itineraryId={id}
          available_dates={available_dates}
          price={price}
        />
      </DialogContent>
    </Dialog>
  );
}
