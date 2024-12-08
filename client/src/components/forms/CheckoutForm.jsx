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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
        <>
            <h1 className="text-3xl font-bold text-center my-8">Checkout</h1>
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
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value);
                                    }}>
                                        <SelectTrigger className="w-[180px]" onValueChange={field.onChange}>
                                            <SelectValue placeholder="Select a country" {...field} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Cities</SelectLabel>
                                                {/* {cities.map((city, index) => (
                                                <SelectItem key={index} value={city}>{city} </SelectItem>
                                            ))} */}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Hotline */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="3 street" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="appartment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Appartment</FormLabel>
                                <FormControl>
                                    <Input placeholder="appartment, suite, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="appartment, suite, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}
