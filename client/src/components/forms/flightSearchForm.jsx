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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { SampleDatePicker } from "../shared/datepicker";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



export default function FlightSearchForm({ onSearch }) {


    function onSubmit(values) {
        const { originLocationCode, destinationLocationCode, departureDate } = values;
        onSearch(originLocationCode, destinationLocationCode, departureDate);
    };
    const cities = [
        "New York", "Los Angeles", "Chicago", "London", "Paris",
        "Tokyo", "Cairo", "Beijing", "Dubai", "Sydney",
        "Berlin", "Toronto", "Mexico City", "Moscow",
        "Seoul", "Sao Paulo", "Mumbai", "Hong Kong",
        "Bangkok", "Istanbul"
    ];

    const formSchema = z.object({
        originLocationCode: z
            .string()
            .min(3, "Must be at least 3 characters"),
        destinationLocationCode: z
            .string()
            .min(3, "Must be at least 3 characters"),
        departureDate: z.date(),
        //   adults: z.preprocess((val) => Number(val), z.number())
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            originLocationCode: "",
            destinationLocationCode: "",
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
                    name="originLocationCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                }}>
                                    <SelectTrigger className="w-full" onValueChange={field.onChange}>
                                        <SelectValue placeholder="Select an origin city" {...field} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Origin</SelectLabel>
                                            {cities.map((city, index) => (
                                                <SelectItem key={index} value={city}>{city} </SelectItem>
                                            ))}
                                        </SelectGroup>

                                    </SelectContent>
                                </Select>

                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="destinationLocationCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                }}>
                                    <SelectTrigger className="w-full" onValueChange={field.onChange}>
                                        <SelectValue placeholder="Select a destination city" {...field} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Destination</SelectLabel>
                                            {cities.map((city, index) => (
                                                <SelectItem key={index} value={city}>{city} </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

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
                                <div>
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

