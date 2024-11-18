import React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { SampleDatePicker } from "@/components/shared/datepicker";
import { PhoneInput } from "@/components/shared/PhoneInput";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
const formSchema = z.object({
  userName: z.string().nonempty({ message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  websiteLink: z.string().url({ message: "Please enter a valid URL" }),
  hotline: z.coerce
    .number()
    .min(5, { message: "Hotline must be at least 5 characters" }),
  companyProfile: z
    .string()
    .nonempty({ message: "Company profile is required" }),
});

export default function AdvertiserProfile({ profile, onRefresh }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: profile.username,
      email: profile.email,
      websiteLink: profile.website,
      hotline: profile.hotline,
      companyProfile: profile.companyName,
    },
  });
  // Define a submit handler
  function onSubmit(values) {
    axios
      .put(`api/advertisers/update/${profile._id}`, {
        oldEmail: profile.email,
        email: values.email,
        website: values.websiteLink,
        hotline: values.hotline,
        companyName: values.companyProfile,
      })
      .then(() => {
        toast({
          title: "Product updated succesfully!",
        });
        onRefresh();
        // onCategoryUpdate();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Product could not be updated",
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
          name="websiteLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website Link</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Hotline */}
        <FormField
          control={form.control}
          name="hotline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotline</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Company Profile */}
        <FormField
          control={form.control}
          name="companyProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Profile</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Write a brief description of your company..."
                  {...field}
                  className="w-full h-28 p-2 border rounded-md"
                />
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
