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
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CheckoutForm({ profile, onRefresh }) {

    const { toast } = useToast();
    const formSchema = z.object({
        email: z.string().email({ message: "Invalid email address" }),
        country: z.string().min(1, "Country is required"),
        fname: z.string().min(1, "First Name is required"),
        lname: z.string().min(1, "Last name is required"),
        address: z.string().min(1, "Address is required"),
        appartment: z.string().min(1, "Appartment is required"),
        city: z.string().min(1, "City is required"),
        governorate: z.string().min(1, "Governorate is required"),
        postalCode: z.string().optional(),
        mobile: z.string().min(1, "Mobile number is required"),

    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            country: "",
            fname: "",
            lname: "",
            address: "",
            appartment: "",
            city: "",
            governorate: "",
            postalCode: "",
            mobile: "",

        },
    });
    // Define a submit handler
    function onSubmit(values) {
        console.log(values);
        //    axios.post();
        //         .then(() => {
        //             toast({
        //                 title: "Product updated succesfully!",
        //             });
        //             onRefresh();
        //             // onCategoryUpdate();
        //         })
        //         .catch((error) => {
        //             toast({
        //                 variant: "destructive",
        //                 title: "Product could not be updated",
        //                 // description: error.response.data.message,
        //             });
        //             console.log(error);
        //         });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


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
                    name="counrty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
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
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <SampleDatePicker value={field.value} onChange={field.onChange} />
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
                    name="jobStudent"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(value) => {
                                        setJobStudent(value);
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
                {jobStudent != "student" && profile.jobTitle && (
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

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
