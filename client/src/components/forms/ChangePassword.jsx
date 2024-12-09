/* eslint-disable react/prop-types */
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
import { useUser } from "@/context/UserContext";

export default function ChangePassword({ profile, onRefresh }) {
  const { toast } = useToast();
  const { userType } = useUser();
  const formSchema = z
    .object({
      passwordold: z
        .string()
        .min(8)
        .max(100, "Password must be at least 8 characters"),
      passwordnew: z
        .string()
        .min(8)
        .max(100, "Password must be at least 8 characters"),
      passwordnewconfirm: z.string().min(8).max(100),
    })
    .refine((data) => data.passwordnew === data.passwordnewconfirm, {
      path: ["passwordnewconfirm"],
      message: "Passwords do not match",
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passwordold: "",
      passwordnew: "",
      passwordnewconfirm: "",
    },
  });

  function onSubmit(values) {
    console.log(values);
    axios
      .post(`api/changepass`, {
        oldPassword: values.passwordold,
        requestedPassword: values.passwordnew,
        userType: userType,
      })
      .then(() => {
        toast({
          title: "Password updated successfully!",
        });
        onRefresh();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: error.response.data.message,
        });
        console.log(error);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Current password */}
        <FormField
          control={form.control}
          name="passwordold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New password */}
        <FormField
          control={form.control}
          name="passwordnew"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm new password */}
        <FormField
          control={form.control}
          name="passwordnewconfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Re-enter new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
