import React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SampleDatePicker } from "@/components/datepicker";
import { PhoneInput } from "@/components/PhoneInput";
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    userName: z.string().nonempty({ message: "Username is required" }), 
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),

}) ;

export default function SellerProfile() {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        userName:"Rooma",
        email:"Rooma@gmail.com",
        name: "",
        description: "",
  
      },
    });
    // Define a submit handler
    function onSubmit(values) {
        console.log(values);
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
            <Input {...field} className="bg-white" />
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
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seller Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white" placeholder="Seller Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seller Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="w-full h-28 p-2 border rounded-md" placeholder="Describe your services" />
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
