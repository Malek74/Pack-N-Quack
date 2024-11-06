/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function FlightBookingForm({ flight, onBook, onSelect }) {



    const formSchema = z.object({
        firstName: z
            .string()
            .min(1, "Must be at least 1 characters")
            .max(50, "Must be less then 50 characters"),
        lastName: z
            .string()
            .min(1, "Must be at least 1 characters")
            .max(50, "Must be less then 50 characters"),
        email: z.string().email({ message: "Invalid email address" }),
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "", // Default value for username
            lastName: "", // Default value for username
            email: "", // Default value for email
        },
    });


    function onSubmit(values) {
        const travelerInfo = values;
        onBook(travelerInfo);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="bg-skyblue hover:bg-sky-800 h-min"
                    onClick={() => onSelect(flight)}
                >Select Flight</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Flight Booking</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 flex flex-col m-4"
                    >
                        <h2 className="text-xl font-bold">Booking from {flight.origin} to {flight.destination}</h2>
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input className="m-3 p-3"
                                            placeholder="John"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input className="m-3 p-3"
                                            placeholder="Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input className="m-3 p-3"
                                            placeholder="johndoe@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>

                            )}
                        />

                        <Button className="place-self-end bg-gold hover:bg-goldhover" type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    );


}