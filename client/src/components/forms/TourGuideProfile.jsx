import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/PhoneInput";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// Define the validation schema
const formSchema = z.object({
  userName: z.string().nonempty({ message: "Username is required" }), // Username validation
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, "Mobile number is required"),
  yearsOfExperience: z.coerce.number({
    message: "Experience must be a number",
  }),
  previousWork: z
    .array(
      z.object({
        title: z.string().nonempty({ message: "Title is required" }),
        description: z
          .string()
          .nonempty({ message: "Description is required" }),
        company: z.string().nonempty({ message: "Company name is required" }),
        durationStart: z
          .string()
          .nonempty({ message: "Start date is required" }),
        durationEnd: z.string().nonempty({ message: "End date is required" }),
      })
    )
    .optional(), // Array of previous work experiences
});

export default function TourGuideProfile({ profile, onRefresh }) {
  const { toast } = useToast();

  const [hasPreviousWork, setHasPreviousWork] = useState(
    profile.previousWork && profile.previousWork.length > 0
  ); // Initialize with existing work experience

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: profile.username,
      email: profile.email,
      phoneNumber: profile.mobile,
      yearsOfExperience: profile.experienceYears,
      previousWork:
        (Array.isArray(profile.previousWork) &&
          profile.previousWork?.map((work) => ({
            ...work,
            durationStart: work.duration?.[0] || "",
            durationEnd: work.duration?.[1] || "",
          }))) ||
        [], // Initialize with existing previous work
    },
  });

  // useFieldArray to manage dynamic fields for previous work
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "previousWork",
  });

  // Define a submit handler
  function onSubmit(values) {
    // If no previous work, ensure previousWork is not sent
    const formattedData = {
      ...values,
      previousWork: hasPreviousWork
        ? values.previousWork?.map((work) => ({
            title: work.title,
            description: work.description,
            company: work.company,
            duration: [work.durationStart, work.durationEnd], // Combine start and end date into duration array
          }))
        : [],
    };

    // Make the PUT request to update the tour guide's profile
    axios
      .put(`api/tourGuide/${profile._id}`, {
        oldEmail: profile.email,
        userName: values.userName,
        email: values.email,
        mobile: values.phoneNumber,
        experienceYears: values.yearsOfExperience,
        previousWork: formattedData.previousWork,
      })
      .then(() => {
        toast({
          title: "Profile updated successfully!",
        });
        onRefresh(); // Assuming you have a refresh function to update the profile UI
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Profile could not be updated",
          description: error.response?.data?.message || "Something went wrong",
        });
        console.error(error);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Username Field */}
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

        {/* Email Field */}
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

        {/* Phone Number Field */}
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

        {/* Years of Experience Field */}
        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  min={0}
                  max={50}
                />
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
          <label htmlFor="hasPreviousWork" className="ml-2">
            Do you have previous work experience?
          </label>
        </div>

        {/* Previous Work Fields - Conditionally Rendered */}
        {hasPreviousWork && (
          <>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Previous Work {index + 1}
                </h3>

                {/* Title Field */}
                <FormField
                  control={form.control}
                  name={`previousWork.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter job title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Field */}
                <FormField
                  control={form.control}
                  name={`previousWork.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter company name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name={`previousWork.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter job description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration Fields */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`previousWork.${index}.durationStart`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`previousWork.${index}.durationEnd`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Remove Work Experience Button */}
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => remove(index)}
                >
                  Remove Work Experience
                </Button>
              </div>
            ))}

            {/* Add More Work Experience Button */}
            <Button
              type="button"
              onClick={() =>
                append({
                  title: "",
                  company: "",
                  description: "",
                  durationStart: "",
                  durationEnd: "",
                })
              }
              className="mt-4"
            >
              Add Work Experience
            </Button>
          </>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
