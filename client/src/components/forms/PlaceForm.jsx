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

import { Input } from "@/components/ui/input"
import axios from "axios"
import { useEffect, useState } from "react"
import Multiselect from "multiselect-react-dropdown"


export default function PlaceForm(props) {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTags = await axios.get("/api/activity/tag");
                setTags(fetchedTags.data);
            } catch (error) {
                console.error(error);
            }
        }; fetchData();
    }, []);

    const activityForm = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        pictures: z.array(z.string()),
        description: z.string(),
        opening_hour: z.string(),
        location: z.string(),
        ticket_price_native: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        ticket_price_foreigner: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        tags: z.array(z.string())

    });
    const form = useForm({
        resolver: zodResolver(activityForm),
        defaultValues: {
            name: "",
            pictures: [""],
            description: "",
            opening_hour: "",
            location: "",
            ticket_price_native: "",
            ticket_price_foreigner: "",
            tags: [""]
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

        console.log(values);
        const cleanedValues = cleanObject(values); // Clean the submitted values
        console.log("EDITTED ACTIVITY FORM SUBMITTED");
        props.createPlaceFunction(cleanedValues);
    }
    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Historical Place Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Pack N Quack" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="1 sentence about the place" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="opening_hour"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Opening Hours</FormLabel>
                            <FormControl>
                                <Input placeholder="7:00 am - 6:00 pm every day" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Cairo, Egypt" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ticket_price_native"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ticket Price for Natives</FormLabel>
                            <FormControl>
                                <Input placeholder="Adult: EGP 60, Student: EGP 30" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ticket_price_foreigner"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ticket Price for Foreigners</FormLabel>
                            <FormControl>
                                <Input placeholder="Adult: €10 , Student: €5" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <Multiselect
                                    className="w-max"
                                    isObject={false}
                                    options={tags.map(tag => tag.name)}  // Populate options with tag names
                                    onSelect={(selectedList) => {
                                        // Update the field value with the selected tags array
                                        field.onChange(selectedList);
                                        // console.log("Selected Tags: ", selectedList);
                                    }}
                                    onRemove={(selectedList) => {
                                        // Update the field value when tags are removed
                                        field.onChange(selectedList);
                                        // console.log("Updated Tags After Removal: ", selectedList);
                                    }}
                                />
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