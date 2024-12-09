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
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { AlertDialogAction, AlertDialogCancel } from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { useUser } from "@/context/UserContext";
import PaymentOptions from "../shared/PaymentOptions";

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
  const [walletBalance, setWalletBalance] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const { toast } = useToast();
  const { prefCurrency } = useUser();

  useEffect(() => {
    const getWalletBalance = async () => {
      try {
        const response = await axios.get(
          `/api/tourist/walletBalance?currency=${prefCurrency}`
        );
        setWalletBalance(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getWalletBalance();
  }, [prefCurrency]);

  const onSubmit = async (values) => {
    try {
      const response = await axios.post("/api/booking/bookEvent", {
        eventID: itineraryId,
        eventType: "itinerary",
        numOfTickets: values.numOfTickets,
        dateSelected: values.dateSelected,
        promoCode: promoCode,
        payByWallet: !(selectedPaymentMethod === "card"),
      });
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
    <div
      className="max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-md"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #e5e7eb" }} // Optional for custom scrollbar styling
    >
      <div className="flex justify-between mb-2">
        <Label className="text-lg font-medium text-gray-700">
          Your Wallet Balance:
        </Label>
        <Label className="text-lg font-medium text-gray-700">
          {walletBalance} {prefCurrency}
        </Label>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Date Selection Field */}
          <FormField
            control={form.control}
            name="dateSelected"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-700">
                  Date
                </FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={selectedDate}
                    onValueChange={(value) => {
                      setSelectedDate(value);
                      form.setValue("dateSelected", value);
                    }}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select a date" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                      <SelectGroup>
                        <SelectLabel className="px-4 py-2 text-sm text-gray-500">
                          Available Dates
                        </SelectLabel>
                        {available_dates.map((date, index) => (
                          <SelectItem
                            key={index}
                            value={date}
                            className="px-4 py-2 hover:bg-blue-50"
                          >
                            {format(new Date(date), "PPP")}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />

          {/* Number of Tickets Field */}
          <FormField
            control={form.control}
            name="numOfTickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-700">
                  Number of Tickets
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter the number of tickets"
                    {...field}
                    className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium text-gray-700">
              Promo Code
            </Label>
            <Input
              type="text"
              placeholder="If you have a promo code, enter it here"
              onValueChange={(value) => {
                setPromoCode(value);
              }}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Payment Options */}
          <PaymentOptions
            selectedOption={selectedPaymentMethod}
            setSelectedOption={setSelectedPaymentMethod}
          />

          {/* Total Price Label */}
          {selectedDate && (
            <Label className="mt-4 block text-gray-800 font-semibold text-2xl text-center">
              {`Your Total will be ${selectedPaymentMethod === "card"
                ? price * form.getValues("numOfTickets")
                : Math.max(
                  price * form.getValues("numOfTickets") - walletBalance,
                  0
                )
                } ${prefCurrency}`}
            </Label>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <AlertDialogCancel className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              className="px-4 py-2 bg-gold text-white rounded-md hover:bg-goldhover focus:outline-none focus:ring-2 focus:ring-gold"
            >
              Book
            </AlertDialogAction>
          </div>
        </form>
      </Form>
    </div>
  );
}

