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
// Define zod schema for comment and rating
const schema = z.object({
  comment: z.string(),
  rating: z
    .number()
    .min(1, "Please provide a rating")
    .max(5, "Rating cannot be more than 5"),
});

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

  // Handle form submission
  const onSubmit = (values) => {
    switch (props.type) {
      case "tourguide":
        // Logic for tour guide user type
        console.log("Handle actions for a tour guide");
        break;

      case "itineraries":
        // Logic for admin user type
        console.log("Handle actions for an admin");
        break;

      case "product":
        // Logic for tourist user type
        console.log("Handle actions for a tourist");
        break;

      case "activity":
        // Logic for travel agency user type
        console.log("Handle actions for an agency");
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
        {/* Rating Field */}
        <FormField
          control={form.control}
          name="rating"
          render={() => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <RatingInput
                  size="large"
                  initialRating={rating}
                  onRatingChange={handleRatingChange}
                />
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
