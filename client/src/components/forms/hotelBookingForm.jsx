/* eslint-disable react/prop-types */
// import { useForm } from "react-hook-form";
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
import { useForm } from "react-hook-form";
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
import { SampleDatePicker } from "../shared/datepicker";
import Loading from "../shared/Loading";
export default function HotelBookingForm({ hotel, onBook, onSelect, selectedHotelDetails, handleShowDetails, loading }) {

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set the time to midnight for comparison

    const formSchema = z.object({
        checkInDate: z
            .date()
            .min(today, { message: "Check-in date cannot be in the past" }), // Ensure it's not in the past

        checkOutDate: z
            .date()
            .min(today, { message: "Check-out date cannot be in the past" }) // Ensure it's not in the past
            .refine((val, ctx) => {
                const checkInDate = ctx?.parent?.checkInDate; // Access the checkInDate from parent
                if (checkInDate && val < checkInDate) {
                    return false; // Check-out date must be after check-in date
                }
                return true;
            }, {
                message: "Check-out date must be after check-in date",
            }),

        adults: z.preprocess((val) => Number(val), z.number()),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            checkInDate: "",
            checkOutDate: "",
            adults: 1,
        },
    });

    const { checkInDate, checkOutDate } = form.getValues();

    function onSubmit(values) {
        const { checkInDate, checkOutDate, adults } = values;
        handleShowDetails({ checkInDate, checkOutDate, adults });

    };
    function onBookRoom(room) {
        onBook({ room, checkInDate, checkOutDate });

    };



    return (
        <Dialog>
            <DialogTrigger>
                <Button className="bg-skyblue hover:bg-sky-800 h-min"
                    onClick={() => onSelect(hotel)}
                >Select Hotel</Button>
            </DialogTrigger>
            <DialogContent style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <DialogHeader>
                    <DialogTitle>Hotel Booking</DialogTitle>
                </DialogHeader>


                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 flex flex-col m-4"
                    >
                        <h2 className="text-xl font-bold">Booking of {hotel.name}</h2>
                        <FormField
                            control={form.control}
                            name="checkInDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Check In Date</FormLabel>
                                    <FormControl>
                                        <div>
                                            <SampleDatePicker {...field} />
                                        </div>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>

                            )}
                        />

                        <FormField
                            control={form.control}
                            name="checkOutDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Check Out Date</FormLabel>
                                    <FormControl>
                                        <div>
                                            <SampleDatePicker {...field} />
                                        </div>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>

                            )}
                        />

                        <FormField
                            control={form.control}
                            name="adults"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adults</FormLabel>
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
                        <Button className="place-self-end bg-gold hover:bg-goldhover" type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>
                <div className="flex justify-center"> {loading && <Loading />}
                </div>


                {(!loading && selectedHotelDetails && Array.isArray(selectedHotelDetails)) ? (selectedHotelDetails.map((room, index) => (

                    < div key={index} className="grid grid-flow-col gap-8 items-center">
                        <div>
                            <h2 className="text-xl font-bold mb-3">Room {index + 1}</h2>

                            <p> <span className="font-semibold mr-1">Room Type:</span> <span className="normal-case"> {room.type}</span></p>
                            <p><span className="font-semibold mr-1">Number of Beds:</span> {room.beds}</p>
                            <p><span className="font-semibold mr-1">Bed Type:</span>  {room.bedType}</p>

                            {/* <p><span className="font-semibold mr-1">Facilities:</span> {room.description.text}</p> */}

                            <p><span className="font-semibold mr-1"> Price: </span>{room.price}</p>
                        </div>
                        <Button className="w-min bg-skyblue  hover:bg-sky-800" onClick={() => onBookRoom(room)}>Confirm Booking</Button>
                    </div>
                ))
                ) : (
                    <div>
                        <p>No rooms available</p>
                    </div>
                )}


            </DialogContent >
        </Dialog >

    );


}