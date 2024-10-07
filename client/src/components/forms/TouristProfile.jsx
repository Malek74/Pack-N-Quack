/* eslint-disable react/prop-types */
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
import { SampleDatePicker } from "@/components/datepicker";
import { PhoneInput } from "@/components/PhoneInput";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
const formSchema = z.object({
  userName: z.string().nonempty({ message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  websiteLink: z.string().url({ message: "Please enter a valid URL" }),
  hotline: z
    .number()
    .min(5, { message: "Hotline must be at least 5 characters" }),
  companyProfile: z
    .string()
    .nonempty({ message: "Company profile is required" }),
});

export default function TouristProfile({ profile, onRefresh }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: profile.email,
      password: profile.password,
      name: profile.name,
      mobile: profile.mobile,
      dob: profile.dob,
      nationality: profile.nationality,
      role: profile.role,
      jobTitle: profile.jobTitle,

    },
  });
  // Define a submit handler
  function onSubmit(values) {
    axios
      .put(`api/tourist/update/${profile._id}`, {
        oldEmail: profile.email,
        email: values.email,
        password: values.password,
        name: values.name,
        mobile: values.mobile,
        dob: values.dob,
        nationality: values.nationality,
        role: values.role,
        jobTitle: values.jobTitle,

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Rooma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Hotline */}
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Of Birth</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input placeholder="egyptian" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="student" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="student" {...field} />
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
