import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RatingInput } from "../shared/RatingsInput";
import PropTypes from "prop-types";
import axios from "axios";

// Define zod schema for comment and rating
const schema = z.object({
  comment: z.string(),
  rating: z
    .number()
    .min(1, "Please provide a rating")
    .max(5, "Rating cannot be more than 5"),
});
RateForm.propTypes = {
  tourGuideId: PropTypes.string,
  itineraryId: PropTypes.string,
  activityId: PropTypes.string,
  type: PropTypes.string,
};

export default function RateForm(props) {
  const [rating, setRating] = useState(0);
  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      comment: "",
      rating: 0, // Initialize with 0 or the current rating if available
    },
  });
  const duckImages = [
    { id: 1, src: "/assets/images/angryDuck.png", label: "Not Good" },
    { id: 2, src: "/assets/images/neutralDuck.png", label: "Neutral" },
    {
      id: 3,
      src: "/assets/images/happyDuck.png",
      label: "Really Good",
    },
  ];

  // Handle form submission
  const onSubmit = async (values) => {
    switch (props.type) {
      case "tourguide":
        // Logic for tour guide user type
        console.log(values);
        try {
          await axios.post(`/api/tourGuide/rate/${props.tourGuideId}`, {
            touristId: "6702cde57d7e2444d9713d8d",
            comment: values.comment,
            rating: values.rating,
          });
        } catch (error) {
          console.error(error);
        }
        break;

      case "itineraries":
        console.log(values);
        try {
          await axios.post(`/api/itinerary/rate/${props.itineraryId}`, {
            touristId: "6702cde57d7e2444d9713d8d",
            comment: values.comment,
            rating: values.rating,
          });
        } catch (error) {
          console.error(error);
        }
        break;

      case "product":
        // Logic for tourist user type
        console.log("Handle actions for a tourist");
        break;

      case "activity":
        // Logic for travel agency user type
        console.log(values);
        try {
          await axios.post(`/api/activity/review/${props.activityId}`, {
            touristID: "6725442e98359339d8b821f0",
            comment: values.comment,
            rating: values.rating,
          });
        } catch (error) {
          console.error(error);
        }
        break;
    }
  };

  // Set the rating value in the form when user selects a rating
  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
    form.setValue("rating", selectedRating); // Update rating in form values
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        {/* Duck Rating Field */}
        <FormField
          control={form.control}
          name="rating"
          render={() => (
            <FormItem>
              <FormLabel>How was your experience?</FormLabel>
              <FormControl>
                <div className="flex justify-around mb-4">
                  {duckImages.map((duck) => {
                    // Determine the color classes based on the duck id
                    const colorClass =
                      rating === duck.id
                        ? duck.id === 1
                          ? "text-red-500 border-red-500"
                          : duck.id === 2
                          ? "text-yellow-500 border-yellow-500"
                          : "text-green-500 border-green-500"
                        : "text-gray-400";

                    return (
                      <button
                        key={duck.id}
                        onClick={() => handleRatingChange(duck.id)}
                        type="button"
                        className={`flex flex-col items-center ${colorClass}`}
                      >
                        <img
                          src={duck.src}
                          alt={duck.label}
                          className={`w-[100px] h-[100px] ${
                            rating === duck.id ? `border-2 ${colorClass}` : ""
                          }`}
                        />
                        {rating === duck.id && (
                          <span
                            className={`text-sm mt-1 font-semibold ${colorClass}`}
                          >
                            {duck.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comment Field */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Leave a comment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Rating Field */}
        <FormField
          control={form.control}
          name="rating"
          render={() => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                {/* Center the RatingInput component */}
                <div className="flex justify-center">
                  <RatingInput
                    size="xl"
                    initialRating={rating}
                    onRatingChange={handleRatingChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button
          type="submit"
          className="place-self-end bg-gold hover:bg-goldhover text-white hover:text-white"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
