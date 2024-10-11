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
import { useToast } from "@/hooks/use-toast";
export default function NewCategoryForm({ onRefresh }) {
  const { toast } = useToast();
  const NewCategoryFormSchema = z.object({
    category: z
      .string()
      .min(2, { message: "Category must be at least 2 characters long." })
      .max(20, { message: "Username must be 20 characters or less." }),
  });
  const form = useForm({
    resolver: zodResolver(NewCategoryFormSchema),
    defaultValues: {
      category: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values) {
    axios
      .post("/api/activity/category", {
        name: values.category, // Adjusted to use POST for creation
      })
      .then((response) => {
        console.log("Category created successfully:", response.data);
        toast({
          title: "Category created succesfully!",
        });
        onRefresh();
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
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input
                  placeholder="Standup comedy, concert, party, etc.."
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter activity category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="place-self-end" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
