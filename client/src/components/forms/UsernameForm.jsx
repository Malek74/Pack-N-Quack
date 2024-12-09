import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function UsernameForm({ onBack, onSubmit }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username);
  };

  const usernameSchema = z.object({
    username: z.string(),
  });
  const form = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <Form {...form}>

      <form
        onSubmit={handleSubmit}
        className="my-2 flex max-w-[350px] flex-1 flex-col gap-6 rounded-2xl bg-white px-12 shadow-md lg:m-8 lg:max-w-[400px] lg:py-12"
      >
              <div className="self-start">
        <Button variant="link" className="m-0 p-0" onClick={onBack}>
          Back to Login
        </Button>
      </div>
        <h1 className="text-2xl font-medium">Forgot Password</h1>
        <FormItem>
          <FormLabel>Enter Username</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <div>
          <Button
            type="submit"
            className="min-h-14 w-full rounded-lg bg-primary text-primary-foreground"
          >
            Send OTP
          </Button>
        </div>
      </form>
    </Form>
  );
}
