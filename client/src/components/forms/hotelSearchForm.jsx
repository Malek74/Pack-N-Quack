/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
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

    const cities = [
        "New York", "Los Angeles", "Chicago", "London", "Paris",
        "Tokyo", "Cairo", "Beijing", "Dubai", "Sydney",
        "Berlin", "Toronto", "Mexico City", "Moscow",
        "Seoul", "Sao Paulo", "Mumbai", "Hong Kong",
        "Bangkok", "Istanbul"
    ];


    function onSubmit(values) {
        const { cityName } = values;
        onSearch(cityName);
    };
    const formSchema = z.object({
        cityName: z
            .string().min(1, { message: "Please select a city" }),

    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cityName: "",

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
                    name="cityName"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                }}>
                                    <SelectTrigger className="w-[180px]" onValueChange={field.onChange}>
                                        <SelectValue placeholder="Select a city" {...field} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Cities</SelectLabel>
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


                <Button className="place-self-end bg-gold hover:bg-goldhover" type="submit">
                    Submit
                </Button>
            </form>
        </Form >



    );

}

