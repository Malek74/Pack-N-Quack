import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
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
import BasicDateTimePicker from "../BasicDateTimePicker"
import Multiselect from "multiselect-react-dropdown"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function PlaceForm({ type }) {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('https://k0gfbwb4-8000.euw.devtunnels.ms/api/activity/category').then((response) => {
            setCategories(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }, []);


    const activityForm = z.object({
        placeName: z.string().min(1, { message: "Name is required" }),
        description: z.string(),
        openingHours: z.string(),
        location: z.string(),
        priceE: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        priceF: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        tags: z.string()

    });
    const form = useForm({
        resolver: zodResolver(activityForm),
        defaultValues: {
            placeName: "",
            description: "",
            openingHours: "",
            location: "",
            priceE: "",
            priceF: "",
            tags: ""
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values) {
        { console.log("NEW ACTIVITY FORM SUBMITTED") }
        console.log(values);


    }

    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                <FormField
                    control={form.control}
                    name="placeName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Historical Place's Name</FormLabel>
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
                    name="OpeningHours"
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
                    name="priceE"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ticket's Price for Egyptians</FormLabel>
                            <FormControl>
                                <Input placeholder="Adult: EGP 60, Student: EGP 30" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="priceF"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ticket's Price for Foreigners</FormLabel>
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
                                <Multiselect className="w-min"
                                    isObject={false}
                                    onKeyPressFn={function noRefCheck() { }}
                                    onRemove={function noRefCheck() { }}
                                    onSearch={function noRefCheck() { }}
                                    onSelect={function noRefCheck() { }}
                                    options={[
                                        'Monuments',
                                        'Museums',
                                        'Religious Sites',
                                        'Palaces',
                                        'Castles'


                                    ]}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button className="place-self-end bg-gold hover:bg-goldhover text-white hover:text-white" type="submit">Submit</Button>
            </form>
        </Form>
    )
}