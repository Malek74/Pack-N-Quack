import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
// Define the schema for validation
const categoryFormSchema = z.object({
  tag: z.string().min(1, { message: "Tag is required." }),
});

export function EditTagDialog({ tag, onTagUpdate }) {
  const { toast } = useToast();
  // Initialize form with default values from the tag being edited
  const updateTagName = (oldName, newName) => {
    axios
      .put(`/api/activity/tag/update/${oldName}`, {
        name: newName,
      })
      .then((response) => {
        toast({
          title: "Tag updated succesfully!",
        });
        onTagUpdate();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Tag could not be updated",
          description: error.response.data.message,
        });
        console.log(error);
      });
  };

  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      tag: tag ?? "", // Set the default value for tag
    },
  });

  // Handle form submission
  function onSubmit(values) {
    updateTagName(tag, values.tag);
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
          <DialogTitle>Edit Tag</DialogTitle>
        </DialogHeader>
        {/* Edit tag Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
          >
            {/* tag Field */}
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
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
