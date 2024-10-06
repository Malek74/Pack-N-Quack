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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useEffect, useState } from "react"
import BasicDateTimePicker from "../BasicDateTimePicker"
import Multiselect from "multiselect-react-dropdown"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pencil } from "lucide-react"

export default function PlaceEditForm({ type }, props) {

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
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-transparent" ><Pencil /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{props.task}</DialogTitle>
                    <DialogDescription>
                        Make changes to your historical place here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                        <FormField
                            control={form.control}
                            name="placeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Historical Place's Name</FormLabel>
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
                            name="OpeningHours"
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
                            name="priceE"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ticket's Price for Egyptians</FormLabel>
                                    <FormControl>
                                        <Input placeholder={props.Eprice} {...field} />
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
            </DialogContent>
        </Dialog>
    )
}