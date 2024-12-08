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
import { Link } from "react-router-dom";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default function LoginForm({ onForgotPassword, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 bg-white gap-6 my-2 lg:m-8 rounded-2xl shadow-md max-w-[350px] lg:max-w-[400px] lg:py-12 px-12"
      >
        <h1 className="text-3xl font-medium">Sign in</h1>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
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
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="button-wrapper">
          <Button variant="link" onClick={onForgotPassword}>
            Forgot Password
          </Button>
        </div>
        <div className="button-wrapper">
          <Button
            type="submit"
            className="rounded-lg text-primary-foreground bg-primary min-h-14 w-full"
          >
            Sign in
          </Button>
        </div>
        <p className="text-md text-muted-foreground">
          Don’t have an account?{" "}
          <Link to="/register" className="text-accent-foreground underline">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}
