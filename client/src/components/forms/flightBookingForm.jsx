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
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export default function FlightBookingForm({ flight, onBook, onSelect, walletBallance }) {

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [promoCode, setPromoCode] = useState("");
    const { prefCurrency } = useUser();



    const formSchema = z.object({
        numTickets: z.preprocess((val) => Number(val), z.number()),


    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            numTickets: 1,

        },
    });


    function onSubmit(values) {
        const numTickets = values.numTickets;
        onBook(numTickets, paymentMethod, promoCode);
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

                            <>

                                <div className="flex justify-between items-center mt-10">
                                    <Label className="text-lg font-semibold">Wallet Balance:</Label>
                                    <p className="text-3xl font-bold text-green-600">{prefCurrency}{" "}{walletBallance}</p>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <Label className="text-lg font-semibold mb-3 block">Choose Payment Method:</Label>
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200 transition-all hover:border-blue-500">
                                            <RadioGroupItem value="wallet" id="wallet" />
                                            <Label htmlFor="wallet" className="flex-grow cursor-pointer">
                                                <span className="font-medium">Pay by Wallet</span>
                                                <p className="text-sm text-gray-500">Use your available balance</p>
                                            </Label>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200 transition-all hover:border-blue-500">
                                            <RadioGroupItem value="card" id="card" />
                                            <Label htmlFor="card" className="flex-grow cursor-pointer">
                                                <span className="font-medium">Pay by Card</span>
                                                <p className="text-sm text-gray-500">Use your credit or debit card</p>
                                            </Label>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                    </RadioGroup>
                                </div>


                                <div className="mb-6 mt-6">
                                    <Label htmlFor="promoCode" className="text-lg font-semibold mb-2">
                                        Got a Promo Code?
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="promoCode"
                                            placeholder="Enter your promo code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="flex-grow mr-2"
                                        />
                                    </div>
                                </div></>

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