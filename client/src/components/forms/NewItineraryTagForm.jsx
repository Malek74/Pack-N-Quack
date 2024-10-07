import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { DialogTrigger } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
export default function NewItineraryTagForm({ onTagCreate }) {
  const { toast } = useToast();

  const NewItineraryTagFormSchema = z.object({
    tag: z
      .string()
      .min(2, { message: "Tag must be at least 2 characters long." })
      .max(20, { message: "Tag must be 20 characters or less." }),
  });

  const form = useForm({
    resolver: zodResolver(NewItineraryTagFormSchema),
    defaultValues: {
      tag: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values) {
    axios
      .post("api/itiernaryTags", {
        name: values.tag, // Adjusted to use POST for creation
      })
      .then((response) => {
        console.log("Tag created successfully:", response.data);
        toast({
          title: "Tag created succesfully!",
        });
        onTagCreate(); // Call the parent function to refresh the table
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Tag could not be created",
          description: error.response.data.message,
        });
        console.error(error);
        console.log(error);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <FormControl>
                <Input
                  placeholder="Standup comedy, concert, party, etc.."
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter Itinerary tag.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogTrigger asChild>
          <Button className="place-self-end" type="submit">
            Submit
          </Button>
        </DialogTrigger>
      </form>
    </Form>
  );
}
