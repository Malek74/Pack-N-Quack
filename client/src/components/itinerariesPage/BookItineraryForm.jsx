import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { AlertDialogAction, AlertDialogCancel } from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { useUser } from "@/context/UserContext";

BookItineraryForm.propTypes = {
  itineraryId: PropTypes.string,
  available_dates: PropTypes.array,
  price: PropTypes.number,
};

const formSchema = z.object({
  dateSelected: z.string().min(1, "Date is required"),
  numOfTickets: z.coerce.number().min(1, "Number of tickets is required"),
});

export default function BookItineraryForm({
  itineraryId,
  available_dates,
  price,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateSelected: "",
      numOfTickets: 1,
    },
  });
  const [selectedDate, setSelectedDate] = useState("");
  const { toast } = useToast();
  const { prefCurrency } = useUser();

  const onSubmit = async (values) => {
    console.log(values);

    try {
      const response = await axios.post(
        "/api/booking/bookEvent/6725442e98359339d8b821f0",
        {
          eventID: itineraryId,
          eventType: "itinerary",
          numOfTickets: values.numOfTickets,
          dateSelected: values.dateSelected,
          payByWallet: false,
        }
      );
      window.location.href = response.data.url;
      toast({
        variant: "success",
        title: "Success",
        description: "Itinerary booked successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: error.response.data.message,
        description: error.response.data.error,
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="dateSelected"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={selectedDate}
                      onValueChange={(value) => {
                        setSelectedDate(value);
                        form.setValue("dateSelected", value);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Available Dates</SelectLabel>
                          {available_dates.map((date, index) => (
                            <SelectItem key={index} value={date}>
                              {format(date, "PPP")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numOfTickets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Tickets</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Enter the number of tickets"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedDate && (
              <Label>{`Your Total will be ${
                price * form.getValues("numOfTickets")
              } ${prefCurrency}`}</Label>
            )}
            <div className="flex justify-between">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-gold hover:bg-goldhover"
                onClick={() => onSubmit(form.getValues())}
              >
                Book
              </AlertDialogAction>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
