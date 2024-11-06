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
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
// Define the schema for validation

export function EditCategoryDialog({ category, onRefresh }) {
  const categoryFormSchema = z.object({
    category: z.string().min(1, { message: "Category is required." }),
  });

  // Initialize form with default values from the category being edited
  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category: category ?? "", // Set the default value for category
    },
  });
  const { toast } = useToast();
  // Initialize form with default values from the tag being edited
  const updateCategory = (oldName, newName) => {
    axios
      .put(`api/activity/category/update/${oldName}`, {
        name: newName,
      })
      .then((response) => {
        toast({
          title: "Category updated succesfully!",
        });
        onRefresh();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Category could not be updated",
          description: error.response.data.message,
        });
        console.log(error);
      });
  };

  // Handle form submission
  function onSubmit(values) {
    console.log(category, values.category);
    updateCategory(category, values.category);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-2">
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only mr-2 sm:not-sr-only sm:whitespace-nowrap">
            Edit
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        {/* Edit Category Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
          >
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
            <DialogClose>
              <Button className="place-self-end" type="submit">
                Save Changes
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
