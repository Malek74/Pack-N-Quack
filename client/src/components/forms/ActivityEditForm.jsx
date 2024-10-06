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
import { useState } from "react"
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
import { Label } from "../ui/label"

export default function ActivityEditForm(props) {








    const [discounts, setDiscounts] = useState([]); // State to hold user-added discounts
    const [newDiscount, setNewDiscount] = useState(''); // State for new discount input

    // Handle adding a new discount
    const handleAddDiscount = () => {
        if (newDiscount.trim() !== '') {
            setDiscounts((prev) => [...prev, newDiscount]); // Add new discount to the list
            setNewDiscount(''); // Clear the input after adding
        }
    };




    const [categories, setCategories] = useState([]);
    const [selectedPriceType, setSelectedPriceType] = useState(props.priceType);
    const [tags, setTags] = useState([]);

    const fetchData = async () => {
        try {
            const fetchedTags = await axios.get("/api/activity/tag");
            const fetchedCategories = await axios.get("/api/activity/category");
            setTags(fetchedTags.data);
            setCategories(fetchedCategories.data);
            form.setValue("booking", discounts);
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

        values.specialDiscounts = discounts;
        const cleanedValues = cleanObject(values); // Clean the submitted values
        console.log("EDITTED ACTIVITY FORM SUBMITTED");
        console.log(cleanedValues); // This will log the cleaned object without empty fields
        props.updateActivityFunction(props.activityID, cleanedValues);
    }

    const activityForm = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        date: z.string(),
        location: z.string(),
        googleMapLink: z.string(),
        price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        minPrice: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        maxPrice: z.coerce.number().min(0, { message: "Price must be a positive number." }),
        priceType: z.string(),
        categoryID: z.string(),
        tags: z.array(z.string()).nonempty({ message: "At least one tag is required" }),
        isBookingOpen: z.boolean(),
        specialDiscounts: z.string(),
    }).optional;
    const form = useForm({
        resolver: zodResolver(activityForm),
        defaultValues: {
            name: "",
            date: "",
            location: "",
            googleMapLink: "",
            price: "",
            minPrice: "",
            maxPrice: "",
            priceType: "",
            categoryID: "",
            tags: "",
            isBookingOpen: false,
            specialDiscounts: ""
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
                    <DialogTitle>Edit the Activity</DialogTitle>
                    <DialogDescription>
                        Make changes to your activity here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                        <FormField
                            control={form.control}
                            name="name"
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
                            name="categoryID"
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
            </DialogContent>
        </Dialog >
    )
}