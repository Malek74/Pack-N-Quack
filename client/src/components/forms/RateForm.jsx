import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
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
import { useToast } from "@/hooks/use-toast";
// Define zod schema for comment and rating
const schema = z.object({
  comment: z.string(),
  rating: z
    .number()
    .min(1, "Please provide a rating")
    .max(5, "Rating cannot be more than 5"),
});

export default function RateForm(props) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [experience, setExperience] = useState();
  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      comment: "",
      rating: 0, // Initialize with 0 or the current rating if available
    },
  });
  const duckImages = [
    { id: 1, src: "/assets/images/angryDuck.jpeg", label: "Not Good" },
    { id: 2, src: "/assets/images/neutralDuck.jpeg", label: "Neutral" },
    {
      id: 3,
      src: "/assets/images/happyDuck.jpeg",
      label: "Really Good",
    },
  ];

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

      case "products":
        axios
          .put("/api/transaction/rate", {
            productId: props.productId,
            userId: props.userId,
            rating: values.rating,
            review: values.comment,
          })
          .then((response) => {
            console.log("Category created successfully:", response.data);
            toast({
              title: "Category created succesfully!",
            });
            props.onRefresh();
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              title: "Category could not be created",
              description: error.response.data.message,
            });
            console.error(error);
            console.log(error);
          });
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
  const handleExperienceChange = (selectedExprience) => {
    setRating(selectedExprience);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        {props.showExperience && (
          <FormField
            control={form.control}
            name="rating"
            render={() => (
              <FormItem>
                <FormLabel>How was your experience?</FormLabel>
                <FormControl>
                  <div className="flex justify-around mb-4">
                    {duckImages.map((duck) => (
                      <button
                        key={duck.id}
                        onClick={() => handleExperienceChange(duck.id)}
                        type="button"
                        className={`flex flex-col items-center ${
                          experience === duck.id
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      >
                        <img
                          src={duck.src}
                          alt={duck.label}
                          className={`w-[100px] h-[100px] ${
                            rating === duck.id
                              ? "border-2 border-green-500"
                              : ""
                          }`}
                        />
                        {experience === duck.id && (
                          <span className="text-sm mt-1 font-semibold">
                            {duck.label}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
