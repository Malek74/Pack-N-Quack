import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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

  return (
    <Form>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 bg-white gap-6 my-2 lg:m-8 rounded-2xl shadow-md max-w-[350px] lg:max-w-[400px] lg:py-12 px-12"
      >
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
        <div className="button-wrapper">
          <Button
            type="submit"
            className="rounded-lg text-primary-foreground bg-primary min-h-14 w-full"
          >
            Send OTP
          </Button>
        </div>
        <div className="button-wrapper">
          <Button variant="link" onClick={onBack}>
            Back to Login
          </Button>
        </div>
      </form>
    </Form>
  );
}
