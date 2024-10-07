/* eslint-disable react/prop-types */
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
  tag: z.string().min(1, { message: "tag is required." }),
});

export function EditTagDialog({ tag }) {
  // Initialize form with default values from the tag being edited
  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      tag: tag ?? "", // Set the default value for tag
    },
  });

  // Handle form submission
  function onSubmit(values) {
    console.log("tag Edited:", values.tag);
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
          <DialogTitle>Edit tag</DialogTitle>
        </DialogHeader>
        {/* Edit tag Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
            {/* tag Field */}
            <FormField
              control={form.control}
              name="Tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>tag</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tag" {...field} />
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
