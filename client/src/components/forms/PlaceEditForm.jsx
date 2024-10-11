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
    DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useState } from "react"
// import Multiselect from "multiselect-react-dropdown"
import { Pencil } from "lucide-react"
import EditOpeningHours from "../editButtonsWillBeReusedLater/EditOpeningHours"
import TicketPriceEditor from "../historicalPage/TicketPriceEditor"
import { Label } from "../ui/label"
import EditTag from "../historicalPage/SelectTag"

export default function PlaceEditForm(props) {

    const [tags, setTags] = useState();
    const [tagsToEdit, setTagsToEdit] = useState(props.tags);
    const [openingHoursOutput, setOpeningHoursOutput] = useState();
    const [tickets, setTickets] = useState();
    const [pictures, setPictures] = useState([]);
    const [newPicture, setNewPicture] = useState('');


    const handleTagsChange = (updatedTags) => {
        setTagsToEdit(updatedTags);
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
    const fetchData = async () => {
        try {
            const response = await axios.get("/api/tags");
            setTags(response.data);
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

        // This will log the cleaned object without empty fields
        values.pictures = pictures;
        values.opening_hour = openingHoursOutput;
        values.tickets = tickets;
        values.tags = tagsToEdit;
        const cleanedValues = cleanObject(values); // Clean the submitted values
        console.log("EDITTED PLACE FORM SUBMITTED");
        console.log(cleanedValues);
        console.log(props.placeID);
        cleanedValues.id = props.placeID;
        props.updatePlaceFunction(props.placeID, cleanedValues);
    }


    const placeForm = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        pictures: z.string(),
        description: z.string(),
        opening_hour: z.string(),
        googleMapLink: z.string().min(1, { message: "MapsLink is required" }),
        location: z.string(),
        tickets: z.string(),
        tags: z.string()

    }).optional;
    const form = useForm({
        resolver: zodResolver(placeForm),
        defaultValues: {
            name: props.name,
            pictures: props.pictures,
            description: props.description,
            opening_hour: props.openingHour,
            location: props.location,
            googleMapLink: props.googleMapLink,
            tickets: props.prices,
            tags: props.tags,

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
                            render={({ field }) => (
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
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>

                                        <div>
                                            <EditTag initialTags={props.tags} onTagsChange={handleTagsChange} />

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
                        <DialogClose className="place-self-end">
                            <Button onClick={() => onSubmit(form.getValues())} className="place-self-end bg-gold hover:bg-goldhover text-white hover:text-white" type="submit">Submit</Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}