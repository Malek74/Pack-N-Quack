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
export default function ComplaintForm({onRefresh}) {
  const { toast } = useToast();
  const complaintFormSchema = z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long." })
      .max(20, { message: "Title must be 20 characters or less." }),

    body: z
    .string()
    .min(4, { message: "Description must be at least 4 characters long." })
    .max(20, { message: "Description must be 20 characters or less." }),
  });
  const form = useForm({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
     title:"",
     body:""
    },
  });

  function getCurrentDate() {
    const date = new Date();
    return date.toLocaleDateString();
  }
 
  function onSubmit(values) {
    axios
    .post(`api/${endpoint}/`, {
        title: values.title,
        body: values.body,
        date: getCurrentDate()
    })
    .then(() => {
        toast({
        title: "Complaint sent!",
        });
        onRefresh();
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
          name="Body"
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
        
        <DialogClose className="place-self-end">
          <Button type="submit">Submit</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
