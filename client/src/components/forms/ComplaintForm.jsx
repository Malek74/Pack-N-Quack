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
import { DialogClose } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
export default function ComplaintForm({ onRefresh, issuerID }) {
  const { toast } = useToast();
  const complaintFormSchema = z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long." })
      .max(50, { message: "Title must be 50 characters or less." }),

    body: z
      .string()
      .min(4, { message: "Description must be at least 4 characters long." })
      .max(4000, { message: "Description must be 4000 characters or less." }),
  });
  const form = useForm({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  function getCurrentDate() {
    const date = new Date();
    return date.toLocaleDateString();
  }

  function onSubmit(values) {
    console.log("we are submitting complaint -----> ", {
      title: values.title,
      body: values.body,
      issuerID: "6702cde57d7e2444d9713d8d",
      date: getCurrentDate(),
    });
    axios
      .post("api/tourist/complaints", {
        title: values.title,
        body: values.body,
        issuerID,
        date: getCurrentDate(),
      })
      .then((response) => {
        toast({
          title: "Complaint sent!",
          variant: "success",
        });
        onRefresh(response.data);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "There was an issue with the complaint request",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter the description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogClose asChild className="place-self-end">
          <Button type="submit">Submit</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
