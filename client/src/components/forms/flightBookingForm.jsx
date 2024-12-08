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
import Paying from "../shared/Paying";

export default function FlightBookingForm({ flight, onBook, onSelect }) {


    const formSchema = z.object({
        numTickets: z.preprocess((val) => Number(val), z.number())

    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            numTickets: 1,
        },
    });


    function onSubmit(values) {
        const numTickets = values;
        onBook(numTickets);
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
                    <DialogTitle className="font-bold">Flight Booking</DialogTitle>
                </DialogHeader>
                <>
                    <div className="flex">
                        <h3 className="font-semibold mr-2">Base Price: </h3>
                        <p>{flight.price.currency} {flight.price.base}</p>
                    </div>

                    <div className="flex">
                        <h3 className="font-semibold mr-2">Total Price:</h3>
                        <p>{flight.price.currency} {flight.price.grandTotal}</p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 flex flex-col m-4"
                        >
                            {/* <h2 className="text-xl font-bold">Booking from {flight.itineraries[0].segments[0].departure.iataCode} to {flight.itineraries[-1].segments[-1].arrival.iataCode}</h2> */}
                            <FormField
                                control={form.control}
                                name="numTickets"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number Of Tickets</FormLabel>
                                        <FormControl>
                                            <Input className="m-3 p-3"
                                                placeholder="1"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>


                                )}
                            />
                            <Paying />
                            <Button className="place-self-end bg-gold hover:bg-goldhover" type="submit">
                                Confirm Booking
                            </Button>
                        </form>
                    </Form>
                </>
            </DialogContent>
        </Dialog >

    );


}