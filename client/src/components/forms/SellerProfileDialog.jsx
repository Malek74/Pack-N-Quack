import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
const formSchema = z.object({
  userName: z.string().nonempty({ message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  description: z.string().min(1, "Please enter a valid URL"),
});

export default function SellerProfileDialog({ profile, onRefresh }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: profile.username,
      email: profile.email,
      description: profile.description,
    },
  });
  // Define a submit handler
  function onSubmit(values) {
    axios
      .put(`api/sellers`, {
        oldEmail: profile.email,
        email: values.email,
        description: values.description,
      })
      .then(() => {
        toast({
          title: "Seller updated succesfully!",
        });
        onRefresh();
        // onCategoryUpdate();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Seller could not be updated",
          // description: error.response.data.message,
        });
        console.log(error);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website Link */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
