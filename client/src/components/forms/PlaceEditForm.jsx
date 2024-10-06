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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useState } from "react"
import Multiselect from "multiselect-react-dropdown"
import { Pencil } from "lucide-react"

export default function PlaceEditForm(props) {

    const [tags, setTags] = useState([]);

    const fetchData = async () => {
        try {
            const fetchedTags = await axios.get("/api/activity/tag");
            setTags(fetchedTags.data);
        } catch (error) {
            console.error(error);
        }
    };

    function cleanObject(obj) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => {
                // Check if the value is not an empty string and not an empty array
                return value !== '' && !(Array.isArray(value) && value.length === 0);
            })
        );
    }

    async function onSubmit(values) {

        const cleanedValues = cleanObject(values); // Clean the submitted values
        console.log("EDITTED PLACE FORM SUBMITTED");
        console.log(cleanedValues); // This will log the cleaned object without empty fields
        props.updatePlaceFunction(props.key, cleanedValues);
    }


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



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={() => fetchData()} className="bg-transparent" ><Pencil /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit the Historical Place</DialogTitle>
                    <DialogDescription>
                        Make changes to your historical place here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Historical Place Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder={props.name} {...field} />
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
                                    <FormLabel>Desrciption</FormLabel>
                                    <FormControl>
                                        <Input placeholder={props.description} {...field} />
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
                                        <Input placeholder={props.hours} {...field} />
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
                                        <Input placeholder={props.location} {...field} />
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
                                        <Input placeholder={props.Eprice} {...field} />
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
                                        <Input placeholder={props.Fprice} {...field} />
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
            </DialogContent>
        </Dialog>
    )
}