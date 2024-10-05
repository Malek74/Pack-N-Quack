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
const formSchema = z.object({
  userName: z.string().nonempty({ message: "Username is required" }), // Username validation
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1,"Mobile number is required"),
  yearsOfExperience: z
  .number({ message: "Experience must be a number" }) // Ensures it's a number
  .int({ message: "Experience must be an integer" })  // Ensures it's an integer
  .min(0, { message: "Experience must be at least 0 years" }) // Minimum 0
  .max(50, { message: "Experience cannot exceed 50 years" })  // Maximum 50

.max(50, { message: "Experience cannot exceed 50 years" }), // Customize max as needed
previousWork: z.string().optional(), // Optional field for previous work
});



export default function TourGuideProfile() {
  const [hasPreviousWork, setHasPreviousWork] = useState(false); // Track if previous work exists
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName:"Rooma",
      email:"Rooma@gmail.com",
      phoneNumber: "",
      yearsOfExperience:0,
      previousWork:"",
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

      <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        
        {/* Years of Experience */}
        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} min={0} max={50} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
{/* Toggle for Previous Work */}
<div className="flex items-center">
          <input
            type="checkbox"
            id="hasPreviousWork"
            checked={hasPreviousWork}
            onChange={(e) => setHasPreviousWork(e.target.checked)}
          />
          <label htmlFor="hasPreviousWork" className="ml-2">Do you have previous work experience?</label>
        </div>

{/* Previous Work Field - Conditionally Rendered */}
{hasPreviousWork && (
          <FormField
            control={form.control}
            name="previousWork"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Work (optional)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Describe your previous work" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
