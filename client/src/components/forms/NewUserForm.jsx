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
export default function NewUserForm({ type, onUserCreate }) {
  const { toast } = useToast();
  const newUserFormSchema = z.object({
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long." })
      .max(20, { message: "Username must be 20 characters or less." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password must be 100 characters or less." }),
  });
  const form = useForm({
    resolver: zodResolver(newUserFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values) {
    const endpoint =
      type === "admin" ? "admins" : type === "gov" ? "touristGovernor" : "";
    if (endpoint) {
      axios
        .post(`api/${endpoint}/`, {
          username: values.username,
          password: values.password,
        })
        .then((response) => {
          console.log("Account created successfully:", response.data);
          toast({
            title: "Account created succesfully!",
          });
          onUserCreate();
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Account could not be created",
            description: error.response.data.message,
          });
          console.error(error);
          console.log(error);
        });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Enter governor username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} />
              </FormControl>
              <FormDescription>Enter governor password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose>
          <Button className="place-self-end" type="submit">
            Submit
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
