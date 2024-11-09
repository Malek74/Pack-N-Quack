/* eslint-disable react/prop-types */
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useEffect, useState } from "react"
import BasicDateTimePicker from "../shared/BasicDateTimePicker"
import Multiselect from "multiselect-react-dropdown"
import { Label } from "../ui/label"

export default function TransportationForm(props) {


    const [discounts, setDiscounts] = useState([]); // State to hold user-added discounts
    const [newDiscount, setNewDiscount] = useState(''); // State for new discount input
    // Handle adding a new discount
    const handleAddDiscount = () => {
        if (newDiscount.trim() !== '') {
            setDiscounts((prev) => [...prev, newDiscount]); // Add new discount to the list
            setNewDiscount(''); // Clear the input after adding
        }
    };


    const transportationForm = z.object({
        advertiserName: z.string().min(1, { message: "Name is required" }),
        date: z.string(),
        type: z.enum(
            ["Bus", "Taxi", "Train"],
            "Please select a Transportation Type."
        ),
        from: z.string().min(1, { message: "Location is required" }),
        to: z.string().min(1, { message: "Location is required" }),
        price: z.coerce.number().min(1, { message: "Price must be a positive number." }),
        isBookingOpen: z.boolean(),
        specialDiscounts: z.string(),

    });
    const form = useForm({
        resolver: zodResolver(transportationForm),
        defaultValues: {
            advertiserName: "",
            date: "",
            from: "",
            to: "",
            price: "",
            type: "",
            isBookingOpen: false,
            specialDiscounts: ""
        },
    });
    function cleanObject(obj) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => {
                // Check if the value is not an empty string and not an empty array
                return value !== '' && !(Array.isArray(value) && value.length === 0);
            })
        );
    }
    async function onSubmit(values) {

        console.log(discounts);
        values.specialDiscounts = discounts;
        console.log(values);
        const cleanedValues = cleanObject(values); // Clean the submitted values
        console.log("EDITTED ACTIVITY FORM SUBMITTED");
        props.createTransportationFunction(cleanedValues);
    }
    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                <FormField
                    control={form.control}
                    name="advertiserName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Advertiser Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Uber" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transportation Type</FormLabel>
                            <FormControl>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                }}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Select Transportation Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bus">Bus</SelectItem>
                                        <SelectItem value="Train">Train</SelectItem>
                                        <SelectItem value="Taxi">Taxi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date & Time</FormLabel>
                            <FormControl>
                                <BasicDateTimePicker
                                    value={field.value} // Bind the value
                                    onChange={(date) => field.onChange(date)} // Update form state
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>From</FormLabel>
                            <FormControl>
                                <Input placeholder="Cairo" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>To</FormLabel>
                            <FormControl>
                                <Input placeholder="Gouna" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input placeholder="100 " {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="isBookingOpen"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Booking</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => {
                                        if (value == "Open") {
                                            field.onChange(true);
                                        }
                                        else {
                                            field.onChange(false);
                                        }  // Pass the value to the form control
                                    }}
                                >
                                    <SelectTrigger className="w-max">
                                        <SelectValue placeholder="Is booking open?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Open">Open</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>

                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="specialDiscounts"
                    render={() => (
                        <FormItem>
                            <FormLabel>Discount</FormLabel>
                            <FormControl>
                                <div>
                                    <div className="mt-4">
                                        <h3 className="font-bold">Special Discounts:</h3>
                                        <ul>
                                            {discounts.map((discount, index) => (
                                                <li key={index}>{discount}</li> // Display added discounts
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid grid-cols-3 items-center self-center justify-evenly gap-2 mt-4">
                                        <Label htmlFor="new-discount" className="text-left">
                                            Add New Discount:
                                        </Label>
                                        <input
                                            type="text"
                                            value={newDiscount}
                                            onChange={(e) => setNewDiscount(e.target.value)} // Update new discount state
                                            className="border rounded w-auto p-2"
                                            placeholder="Enter new discount"
                                        />
                                        <Button
                                            className="w-min bg-gold hover:bg-goldhover text-white"
                                            onClick={handleAddDiscount}
                                        >
                                            Add Discount
                                        </Button>
                                    </div></div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button onClick={() => onSubmit(form.getValues())} className="place-self-end bg-gold hover:bg-goldhover text-white hover:text-white" type="submit">Submit</Button>
            </form>
        </Form>
    )
}