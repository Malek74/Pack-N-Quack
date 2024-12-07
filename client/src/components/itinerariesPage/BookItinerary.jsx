import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import BookItineraryForm from "@/components/ItinerariesPage/BookItineraryForm";
import PropTypes from "prop-types";

BookItinerary.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  available_dates: PropTypes.array,
  price: PropTypes.number,
};
export default function BookItinerary({ name, id, available_dates, price }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline">Book Itinerary</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Book {name} ?</AlertDialogTitle>
          <AlertDialogDescription>
            Please fill out the booking form!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <BookItineraryForm
          itineraryId={id}
          available_dates={available_dates}
          price={price}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
