import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const resetPasswordSchema = z.object({
  otp: z.string().min(6, "OTP must be at least 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export default function ResetPasswordForm({ onBack, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 bg-white gap-6 my-2 lg:m-8 rounded-2xl shadow-md max-w-[350px] lg:max-w-[400px] lg:py-12 px-12"
      >
        <h1 className="text-2xl font-medium">Reset Password</h1>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the OTP sent to your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="button-wrapper">
          <Button
            type="submit"
            className="rounded-lg text-primary-foreground bg-primary min-h-14 w-full"
          >
            Reset Password
          </Button>
        </div>
        <div className="button-wrapper">
          <Button variant="link" onClick={onBack}>
            Back to Username
          </Button>
        </div>
      </form>
    </Form>
  );
}
