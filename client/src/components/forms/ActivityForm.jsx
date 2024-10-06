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


export default function ActivityForm({ type }) {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('https://k0gfbwb4-8000.euw.devtunnels.ms/api/activity/category').then((response) => {
            setCategories(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }, []);


    const activityForm = z.object({
        activityName: z.string().min(1, { message: "Name is required" }),
        time: z.string(),
        location: z.string(),
        googlemaps: z.string(),
        price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        category: z.string(),
        tags: z.string(),
        booking: z.string(),
        discount: z.string()


    });
    const form = useForm({
        resolver: zodResolver(activityForm),
        defaultValues: {
            activityName: "",
            time: "",
            location: "",
            googlemaps: "",
            price: "",
            category: "",
            tags: "",
            booking: "",
            discount: ""
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
                    name="activityName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Activity Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Pack N Quack" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date & Time</FormLabel>
                            <FormControl>
                                <BasicDateTimePicker></BasicDateTimePicker>
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
                    name="googlemaps"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Google Maps's Link</FormLabel>
                            <FormControl>
                                <Input placeholder="https://maps.app.goo.gl/pqaptgj1zwxdnHNY9" {...field} />
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
                            <FormLabel>Ticket's Price</FormLabel>
                            <FormControl>
                                <Input placeholder="EGP 50" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select>
                                    <SelectTrigger className="w-max" onValueChange={field.onChange}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem value={category.name} key={category._id}>{category.name}</SelectItem>
                                        ))}
                                        <SelectItem value="Concert">Concert</SelectItem>
                                        <SelectItem value="Theatre">Theatre</SelectItem>

                                    </SelectContent>
                                </Select>
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
                                        'Concert',
                                        'Entertainment',
                                        'Theatre',

                                    ]}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="booking"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Booking</FormLabel>
                            <FormControl>
                                <Select>
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
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Special Discount</FormLabel>
                            <FormControl>
                                <Input placeholder="50% off" {...field} />
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