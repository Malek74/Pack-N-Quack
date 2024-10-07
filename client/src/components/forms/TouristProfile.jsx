import React from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { SampleDatePicker } from "../datepicker";
import { PhoneInput } from "@/components/PhoneInput";
import { nationalities } from "../nationalities";
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, "Mobile number is required"),
  nationality: z.string().nonempty("Nationality is required"),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  jobStudent: z
    .string()
    .nonempty({ message: "Please select either job or student" }),
});

export default function TouristProfile() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "Rooma",
      email: "rooma@gmail.com",
      phoneNumber: "",
      nationality: "",
      dob: "",
      jobStudent: "",
      wallet: "0",
    },
  });

  // Define a submit handler
  function onSubmit(values) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Username (uneditable) */}
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  {...field}
                  className="bg-gray-200 cursor-not-allowed"
                />
              </FormControl>
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

        {/* phone number */}
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
        {/* Nationality (Select) */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <Select onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Nationalities</SelectLabel>
                    {nationalities.map((nation, index) => (
                      <SelectItem key={index} value={nation}>
                        {nation}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/*DOB*/}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <SampleDatePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Job/Student (Radio Buttons) */}
        <FormField
          control={form.control}
          name="jobStudent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you a job holder or a student?</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value} // Bind the selected value
                  onChange={field.onChange} // Handle changes
                  className="flex space-x-4"
                >
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="job"
                      checked={field.value === "job"} // Check if value is "job"
                      onChange={() => field.onChange("job")} // Handle "job" selection
                    />
                    <span>Job</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="student"
                      checked={field.value === "student"} // Check if value is "student"
                      onChange={() => field.onChange("student")} // Handle "student" selection
                    />
                    <span>Student</span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Wallet (uneditable) */}
        <FormField
          control={form.control}
          name="wallet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  {...field}
                  className="bg-gray-200 cursor-not-allowed"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
