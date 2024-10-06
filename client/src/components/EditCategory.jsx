import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

// Define the schema for validation
const categoryFormSchema = z.object({
  category: z.string().min(1, { message: "Category is required." }),
});

export function EditCategoryDialog({ category }) {
  // Initialize form with default values from the category being edited
  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category: category ?? "", // Set the default value for category
    },
  });

  // Handle form submission
  function onSubmit(values) {
    console.log("Category Edited:", values.category);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Pencil /> <p> Edit </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        {/* Edit Category Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="place-self-end" type="submit">
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
