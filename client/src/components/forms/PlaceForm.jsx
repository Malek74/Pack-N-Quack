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
import EditOpeningHours from "../editButtonsWillBeReusedLater/EditOpeningHours"
import EditTag from "../historicalPage/SelectTag"
import TicketPriceEditor from "../historicalPage/TicketPriceEditor"
import { Label } from "../ui/label"

export default function PlaceForm(props) {
    const [tags, setTags] = useState([]);
    const [openingHoursOutput, setOpeningHoursOutput] = useState();
    const [tickets, setTickets] = useState();
    const [pictures, setPictures] = useState([]);
    const [newPicture, setNewPicture] = useState('');

    const handleTagsChange = (updatedTags) => {
        setTags(updatedTags);
        console.log("Updated Tags:", updatedTags);
    };
    const handleAddPicture = () => {
        if (newPicture.trim() !== '') {
            setPictures((prev) => [...prev, newPicture]); // Add new discount to the list
            setNewPicture(''); // Clear the input after adding
        }
    };


    const handleTicketsChange = (updatedTickets) => {
        setTickets(updatedTickets);
        // You can also send updatedTickets to an API or other logic here
    };
    const handleOpeningHoursChange = (updatedOpeningHours) => {
        console.log(updatedOpeningHours);
        setOpeningHoursOutput(updatedOpeningHours);
    };
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

    const placeForm = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        pictures: z.string(),
        description: z.string().min(1, { message: "Description is required" }),
        opening_hour: z.string(),
        googleMapLink: z.string().min(1, { message: "MapsLink is required" }),
        location: z.string().min(1, { message: "Location is required" }),
        tickets: z.string().optional(),
        tags: z.string().optional(),

    });
    const form = useForm({
        resolver: zodResolver(placeForm),
        defaultValues: {
            name: "",
            pictures: "",
            description: "",
            opening_hour: "",
            googleMapLink: "",
            location: "",
            tickets: "",
            tags: "",

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

        values.pictures = pictures;
        values.opening_hour = openingHoursOutput;
        values.tickets = tickets;
        values.tags = tags;
        const cleanedValues = cleanObject(values); // Clean the submitted values
        console.log("EDITTED PLACE FORM SUBMITTED");
        console.log(cleanedValues);
        console.log(props.placeID);
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
                    render={() => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <EditOpeningHours onOpeningHoursChange={handleOpeningHoursChange} />
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
                    name="googleMapLink"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Google Maps Link</FormLabel>
                            <FormControl>
                                <Input placeholder="https://maps.app.goo.gl/pqaptgj1zwxdnHNY9" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tickets"
                    render={() => (
                        <FormItem>
                            <FormLabel>Ticket Prices</FormLabel>
                            <FormControl>
                                <div>
                                    <TicketPriceEditor
                                        initialTickets={tickets}
                                        onTicketsChange={handleTicketsChange}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={() => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>

                                <div>
                                    <EditTag initialTags={[]} onTagsChange={handleTagsChange} />

                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pictures"
                    render={() => (
                        <FormItem>
                            <FormLabel>Pictures</FormLabel>
                            <FormControl>
                                <div>
                                    <div className="mt-4">
                                        <h3 className="font-bold">Pictures Paths:</h3>
                                        <ul>
                                            {pictures.map((picture, index) => (
                                                <li key={index}>{picture}</li> // Display added discounts
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid grid-cols-3 items-center self-center justify-evenly gap-2 mt-4">
                                        <Label htmlFor="new-discount" className="text-left">
                                            Add New Picture:
                                        </Label>
                                        <input
                                            type="text"
                                            value={newPicture}
                                            onChange={(e) => setNewPicture(e.target.value)}
                                            className="border rounded w-auto p-2"
                                            placeholder="Enter new picture"
                                        />
                                        <Button
                                            className="w-min bg-gold hover:bg-goldhover text-white"
                                            onClick={handleAddPicture}
                                        >
                                            Add Picture
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