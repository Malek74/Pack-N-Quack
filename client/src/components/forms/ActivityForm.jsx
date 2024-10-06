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
import BasicDateTimePicker from "../BasicDateTimePicker"
import Multiselect from "multiselect-react-dropdown"


export default function ActivityForm() {

    const [categories, setCategories] = useState([]);
    const [selectedPriceType, setSelectedPriceType] = useState();
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTags = await axios.get("/api/activity/tag");
                const fetchedCategories = await axios.get("/api/activity/category");
                setTags(fetchedTags.data);
                setCategories(fetchedCategories.data);
            } catch (error) {
                console.error(error);
            }
        }; fetchData();
    }, []);








    const activityForm = z.object({
        activityName: z.string().min(1, { message: "Name is required" }),
        time: z.string(),
        location: z.string().min(1, { message: "Location is required" }),
        googlemaps: z.string().min(1, { message: "MapsLink is required" }),
        price: z.coerce.number().min(1, { message: "Price must be a positive number." }),
        minPrice: z.coerce.number().min(1, { message: "Price must be a positive number." }),
        maxPrice: z.coerce.number().min(1, { message: "Price must be a positive number." }),
        priceType: z.string().min(1, { message: "Please choose a type" }),
        category: z.string().min(1, { message: "Please choose a type" }),
        tags: z.array(z.string()).nonempty({ message: "At least one tag is required" }),
        booking: z.string().min(1, { message: "Please choose if booking is open or closed" }),
        discount: z.string(),

    });
    const form = useForm({
        resolver: zodResolver(activityForm),
        defaultValues: {
            activityName: "",
            time: "",
            location: "",
            googlemaps: "",
            price: "",
            minPrice: "",
            maxPrice: "",
            priceType: "",
            category: "",
            tags: "",
            booking: "",
            discount: ""
        },
    });

    function onSubmit(values) {
        console.log(values);
        console.log("NEW ACTIVITY FORM SUBMITTED");
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
                    name="priceType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price Type</FormLabel>
                            <FormControl>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedPriceType(value);  // Set the selected price type
                                }}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Select Price Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                        <SelectItem value="range">Range</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Conditionally render based on priceType */}
                {selectedPriceType === "fixed" && (
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ticket Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="EGP 250" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {selectedPriceType === "range" && (
                    <>
                        <FormField
                            control={form.control}
                            name="minPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="EGP 500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="EGP 2500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);  // Pass the value to the form control
                                        // console.log("Selected Category: ", value);  // Log the selected value
                                    }}
                                >
                                    <SelectTrigger className="w-max" onValueChange={field.onChange}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem value={category.name} key={category._id}>{category.name}</SelectItem>
                                        ))}


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

                <FormField
                    control={form.control}
                    name="booking"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Booking</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);  // Pass the value to the form control
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
                <Button onClick={() => onSubmit(form.getValues())} className="place-self-end bg-gold hover:bg-goldhover text-white hover:text-white" type="submit">Submit</Button>
            </form>
        </Form>
    )
}