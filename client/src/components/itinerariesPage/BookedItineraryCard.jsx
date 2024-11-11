import PropTypes from "prop-types";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Rating } from "../shared/Rating";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

BookedItineraryCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.array,
  price: PropTypes.number,
  rating: PropTypes.number,
  numberOfReviews: PropTypes.number,
  coverImage: PropTypes.string,
  touristClicked: PropTypes.bool,
  isFlagged: PropTypes.bool,
  isActive: PropTypes.bool,
  tourGuideClicked: PropTypes.bool,
  small: PropTypes.bool,
  adminClicked: PropTypes.bool,
  bookingDate: PropTypes.string,
  eventDate: PropTypes.string,
  numOfTickets: PropTypes.number,
  bookingId: PropTypes.string,
};
export default function BookedItineraryCard({
  bookingId,
  name,
  description,
  tags,
  price,
  rating,
  numberOfReviews,
  coverImage,
  bookingDate,
  eventDate,
  numOfTickets,
  small = false,
}) {
  const cardClassName = small
    ? "shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400 hover:cursor-pointer w-[450px] h-[400px]"
    : "shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400 hover:cursor-pointer w-[550px] h-[450px]";
  const imgClassName = small
    ? "rounded-lg rounded-b-none h-[200px] w-full object-fill"
    : "rounded-lg rounded-b-none h-[200px] w-full object-fill";

  const { toast } = useToast();
  const handleCancelBooking = async () => {
    try {
      const response = await axios.post(
        "/api/booking/cancelBooking/6725442e98359339d8b821f0",
        {
          eventType: "itinerary",
          eventID: bookingId,
        }
      );
      console.log(response.data);
      toast({
        variant: "success",
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: error.response.data.message,
        description: error.response.data.error,
      });
    }
  };
  return (
    <Card className={cardClassName}>
      <img
        src={
          coverImage ||
          "https://media.istockphoto.com/id/1406854851/vector/travel-time-vector-background-design-time-to-travel-text-in-blue-space-with-3d-tourist.jpg?s=612x612&w=0&k=20&c=GMlx-8LNNhoQdE4cbKwu2apsLcmmTKj5pq77ToAu8BM%3D"
        }
        className={imgClassName}
      />
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label className="text-lg font-semibold">{name}</Label>
            <Button
              className="text-md bg-red-500 text-white hover:bg-red-600 hover:text-white"
              onClick={() => {
                handleCancelBooking();
              }}
            >
              Cancel Booking
            </Button>
          </div>
          <p className="text-sm text-neutral-400 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {description}
          </p>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <Label className="font-semibold text-lg text-gray-500">
                {`Price per ticket: ${price} ${"USD"}`}
              </Label>
              <Label className="font-semibold text-lg text-gray-500">
                {`Number Of tickets: ${numOfTickets}`}
              </Label>
            </div>
            <Rating rating={rating} numberOfReviews={numberOfReviews} />
          </div>
          <div className="flex flex-col">
            <Label className="font-semibold text-md text-gray-500">
              {`Booked on: ${format(bookingDate, "PPP")}`}
            </Label>
            <Label className="font-semibold text-md text-gray-500">
              {`Event date: ${format(eventDate, "PPP")}`}
            </Label>
          </div>
          <div className="flex gap-2">
            {tags.map((t) => (
              <Label
                key={t._id}
                className="text-sm text-gray-500 border-gray-500 rounded-full border px-2"
              >
                {`#${t.tag}`}
              </Label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
