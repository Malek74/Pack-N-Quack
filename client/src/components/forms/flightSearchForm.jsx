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
import { SampleDatePicker } from "../shared/datepicker";



export default function FlightSearchForm({ onSearch }) {


    function onSubmit(values) {
        const { origin, destination, departureDate } = values;
        onSearch(origin, destination, departureDate);
    };
    const formSchema = z.object({
        origin: z
            .string()
            .min(3, "Must be at least 3 characters"),
        destination: z
            .string()
            .min(3, "Must be at least 3 characters"),
        departureDate: z.date()
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            origin: "",
            destination: "",
            departureDate: "",
        },
    });


    return (

        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 flex flex-col m-4 "
            >
                <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Origin</FormLabel>
                            <FormControl>
                                <Input className="m-3 p-3"
                                    placeholder="Enter origin (e.g., JFK)"
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
                    name="destination"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <FormControl>
                                <Input className="m-3 p-3"
                                    placeholder="Enter destination (e.g., LAX)"
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
                    name="departureDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Departure Date</FormLabel>
                            <br />
                            <FormControl >
                                <div className="m-3">
                                    <SampleDatePicker {...field} />
                                </div>
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



    );

}

