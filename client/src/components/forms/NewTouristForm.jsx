import React, { useState } from "react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { CheckIcon } from "lucide-react";
import axios from "axios";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PhoneInput } from "@/components/shared/PhoneInput";
import { SampleDatePicker } from "@/components/shared/datepicker";
import { nationalities } from "../shared/nationalities";
import { Checkbox } from "@/components/ui/checkbox"
import DialogTerms from "../shared/DialogTerms";

export default function NewTouristForm(props) {
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const formSchema = z.object({
    name: z
      .string()
      .min(5, "Must be at least 5 characters")
      .max(50, "Must be less then 50 characters"),
    username: z
      .string()
      .min(3, "Must be at least 2 characters")
      .max(50, "Must be less then 50 characters"),
    email: z.string().email(),
    password: z.string().min(8).max(100), // Password validation with min 8 characters
    mobileNumber: z.string().min(1, "Mobile number is required."), // Make mobile number required
    nationality: z.string().min(1, "Nationality is required."), // Make nationality required
    status: z.enum(["job", "student"], "Please select a status."), // Radio group validation
    dob: z
      .union([z.date(), z.null()]) // Allow both date or null
      .refine((date) => date === null || !isNaN(date.getTime()), {
        message: "Date of birth is missing or invalid",
      })
      .transform((date) => (date ? date.toISOString() : null)), // Convert to ISO string or keep null
      terms: z.boolean().refine((value) => value === true, {
        message: "You must accept terms and conditions.",
      }), 
      preferedFirstTag: z.string().min(1, "Prefered tag is required"),
    preferedSecondTag: z.string().min(1, "Prefered tag is required"),
    preferedFirstCategory: z.string().min(1, "Prefered category is required"),
    preferedSecondCategory: z.string().min(1, "Prefered category is required"),
  });

  // 1.1 Define your form for tourist signup.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", // Default value for username
      username: "", // Default value for username
      email: "", // Default value for email
      password: "", // Default value for password
      mobileNumber: "", // Default value for mobile number
      nationality: "", // Default value for nationality
      status: undefined, // Default value for status dropdown
      jobTitle: "", // Default value for job title (new)
      dob: "", 
      terms: false,
      dob: "", // Default value for date of birth
      preferedFirstTag: "", // Default value for prefered first tag
      preferedSecondTag: "", // Default value for prefered second tag
      preferedFirstCategory: "", // Default value for prefered first category
      preferedSecondCategory: "", // Default value for prefered second category
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTags = await axios.get("/api/activity/tag");
        const fetchedCategories = await axios.get("/api/activity/category");
        setTags(fetchedTags.data);
        setCategories(fetchedCategories.data);
      } catch (error) {
        console.error(error);
      }
    }; fetchData();
  }, []);


  // 2.1 Define a submit handler for the Tourist form.
  function onSubmit(values) {
    props.submitFunction(values);
    console.log("Form values submitted:", values); // Log form values to ensure they are correct
    console.log("Form errors:", form.formState.errors); // Log any validation errors
  }


  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g John Smith" {...field} />
              </FormControl>
              <FormDescription>
                This is your first and last name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g johnsmith20 " {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@address.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password must be at least (8) characters"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <PhoneInput
                  id="phone"
                  name="mobileNumber" // Match the form name for consistency
                  onChange={(value) => {
                    // Update the mobile number and trigger validation immediately
                    form.setValue("mobileNumber", value, {
                      shouldValidate: true,
                    });

                    // Trigger validation for the mobileNumber field to update it instantly
                    form.trigger("mobileNumber");
                  }}
                  placeholder="Enter your mobile number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality Field */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Nationality</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? nationalities.find(
                          (nationality) => nationality === field.value
                        )
                        : "Select nationality"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search nationality..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No nationality found.</CommandEmpty>
                      <CommandGroup>
                        {nationalities.map((nationality) => (
                          <CommandItem
                            value={nationality}
                            key={nationality}
                            onSelect={() => {
                              // Update the nationality field immediately
                              form.setValue("nationality", nationality, {
                                shouldValidate: true,
                              });

                              // Trigger validation on the nationality field to update it instantly
                              form.trigger("nationality");
                            }}
                          >
                            {nationality}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                nationality === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the nationality that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <SampleDatePicker value={field.value} onChange={field.onChange} />
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Dropdown */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    setStatus(value);
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="job" />
                    </FormControl>
                    <FormLabel className="font-normal">Job</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="student" />
                    </FormControl>
                    <FormLabel className="font-normal">Student</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {status === "job" && (
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g engineer,doctor etc..." {...field} />
                </FormControl>
                <FormDescription>state your job.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {/* Terms and Conditions */}
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  {...field} 
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our {" "}
                  <DialogTerms></DialogTerms>
                 
                </FormDescription>
              </div>
            </FormItem>
          )}
        />


        {/* First Category Field */}
        <FormField
          control={form.control}
          name="preferedFirstCategory"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Preferred Category</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categories.find(
                          (category) => category === field.value
                        )
                        : "Select category"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search category..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            value={category}
                            key={category}
                            onSelect={() => {
                              // Update the nationality field immediately
                              form.setValue("category", category, {
                                shouldValidate: true,
                              });

                              // Trigger validation on the nationality field to update it instantly
                              form.trigger("category");
                            }}
                          >
                            {category}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                category === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Second Category Field */}
        <FormField
          control={form.control}
          name="preferedSecondCategory"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categories.find(
                          (category) => category === field.value
                        )
                        : "Select category"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search category..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            value={category}
                            key={category}
                            onSelect={() => {
                              // Update the nationality field immediately
                              form.setValue("category", category, {
                                shouldValidate: true,
                              });

                              // Trigger validation on the nationality field to update it instantly
                              form.trigger("category");
                            }}
                          >
                            {category}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                category === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />


        <Button variant="secondary" type="submit">
          Create account
        </Button>
      </form>
    </Form>
  );
};

