import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Calendar,
  MapPin,
  ChevronsUpDown,
  Ticket,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,

} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; import { Input } from "@/components/ui/input";
import Loading from "../components/shared/Loading";
import TransportationBackground from "/assets/images/Tram.jpg";

export default function SingleTransportationPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const { prefCurrency } = useUser();
  const [transportation, setTransportation] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const ticketNumbers = Array.from({ length: 50 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));

  const fetchTransportation = async () => {
    try {
      const response = await axios.get(`/api/transportation/${id}`);
      setTransportation(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get(`/api/tourist/walletBalance`);
      setWalletBalance(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransportation();
    fetchWalletBalance();
  }, [id]);

  if (isLoading || !transportation) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <Loading size="xl" />
      </div>
    );
  }

  const {
    name,
    type,
    date,
    origin,
    destination,
    price,
    available,
    img = TransportationBackground,
  } = transportation;

  const handleBooking = async () => {
    try {
      const response = await axios.post(`/api/transportation/book`, {
        eventID: id,
        numOfTickets: numberOfTickets,
        promoCode,
        payByWallet: paymentMethod === "wallet",
        date,
      });
      toast({
        title: "Booking Confirmed!",
        description: "Your transportation has been booked successfully.",
        variant: "success",
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      toast({
        description: error.response?.data?.error || "Booking failed.",
        variant: "destructive",
      });
    }
  };

  const calculateTotalPrice = () =>
    price * numberOfTickets;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-blue-50 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="relative">
          <img
            className="w-full h-64 object-cover"
            src={img}
            alt={name}
          />
          <div className="absolute inset-0 bg-blue-400 opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
            <h1 className="font-bold text-4xl text-white mb-2">{name}</h1>
            <span className="text-yellow-300 text-xl">{type}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4 text-gray-600">
            <Calendar className="mr-2" />
            <span>{new Date(date).toLocaleString()}</span>
          </div>

          <div className="flex items-center mb-4 text-gray-600">
            <MapPin className="mr-2" />
            <span>
              {origin} &rarr; {destination}
            </span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-bold text-blue-600">
              {prefCurrency} {price}
            </span>
          </div>

          {available && (
            <div className="mb-6">
              <Label className="text-lg font-semibold mb-2">
                How many ducks in your flock?
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? `${value} ticket${parseInt(value) > 1 ? "s" : ""}`
                      : "Select number of tickets..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search number..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No number found.</CommandEmpty>
                      <CommandGroup>
                        {ticketNumbers.map((number) => (
                          <CommandItem
                            key={number.value}
                            value={number.value}
                            onSelect={(currentValue) => {
                              setNumberOfTickets(parseInt(currentValue));
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            {number.label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                value === number.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="mb-6">
            <Label className="text-lg font-semibold">Promo Code:</Label>
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <Label className="text-lg font-semibold">Wallet Balance:</Label>
            <span className="text-2xl font-bold text-green-600">
              {prefCurrency} {walletBalance}
            </span>
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

          <div className="my-6">
            <span className="text-lg font-semibold">
              Total Price:
            </span>
            <span className="text-2xl font-bold text-blue-600 ml-2">
              {prefCurrency} {calculateTotalPrice()}
            </span>
          </div>

          {available && (
            <Button
              className="w-full text-xl bg-blue-600 hover:bg-blue-800"
              onClick={handleBooking}
            >
              Book Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
