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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react"

export default function ActivityEditForm(props) {

    const [discounts, setDiscounts] = useState([""]);  // State to track multiple discounts
    const [categories, setCategories] = useState([]);
    const [selectedPriceType, setSelectedPriceType] = useState(props.priceType);
    const [tags, setTags] = useState([]);

    const fetchData = async () => {
        try {
            const fetchedTags = await axios.get("/api/activity/tag");
            const fetchedCategories = await axios.get("/api/activity/category");
            setTags(fetchedTags.data);
            setCategories(fetchedCategories.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addDiscountField = () => {
        setDiscounts([...discounts, { value: "" }]);
    };

    const removeDiscountField = (index) => {
        const updatedDiscounts = discounts.filter((_, i) => i !== index);
        setDiscounts(updatedDiscounts);
    };

    const handleDiscountChange = (index, value) => {
        const updatedDiscounts = [...discounts];
        updatedDiscounts[index].value = value;
        setDiscounts(updatedDiscounts);
    };


    function onSubmit(values) {
        console.log("NEW ACTIVITY FORM SUBMITTED")
        values.discounts = discounts;
        console.log(values);
        console.log("Discounts: ", discounts);



    }
    const activityForm = z.object({
        activityName: z.string().min(1, { message: "Name is required" }),
        time: z.string(),
        location: z.string(),
        googlemaps: z.string(),
        price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        minPrice: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        maxPrice: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        priceType: z.string(),
        category: z.string(),
        tags: z.array(z.string()).nonempty({ message: "At least one tag is required" }),
        booking: z.string(),
        discounts: z.array(z.object({
            value: z.string().min(1, { message: "Discount value is required" })
        }))

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
            discounts: [''],
        },
    });

    // 2. Define a submit handler.


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={() => fetchData()} className="bg-transparent" ><Pencil /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{props.task}</DialogTitle>
                    <DialogDescription>
                        Make changes to your activity here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                        <FormField
                            control={form.control}
                            name="activityName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Activity Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder={props.name} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time"
                            render={() => (
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
                                        <Input placeholder={props.location} {...field} />
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
                                        <Input placeholder={props.mapsSrc} {...field} />
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
                                                <SelectValue placeholder={props.priceType} />
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
                                            <Input placeholder={props.price} {...field} />
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
                                                <Input placeholder={props.minPrice} {...field} />
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
                                                <Input placeholder={props.maxPrice} {...field} />
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
                                            <SelectTrigger className="w-48" onValueChange={field.onChange}>
                                                <SelectValue placeholder={props.category}  {...field} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem value={category.name} key={category._id}>{category.name} </SelectItem>
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
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder={props.booking} />
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
                        {discounts.map((discount, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={`discounts[${index}].value`}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Special Discount {index + 1}</FormLabel>
                                        <FormControl>
                                            <div className="flex space-x-2">
                                                <Input
                                                    value={discount.value}
                                                    onChange={(e) => handleDiscountChange(index, e.target.value)}
                                                    placeholder="Discount"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => removeDiscountField(index)}
                                                    className="bg-red-500 hover:bg-red-600"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            type="button"
                            onClick={addDiscountField}
                            className="bg-skyblue w-min hover:bg-[#28788c]"
                        >
                            Add Discount
                        </Button>

                        <Button onClick={() => onSubmit(form.getValues())} className="place-self-end bg-gold hover:bg-goldhover text-white hover:text-white" type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}