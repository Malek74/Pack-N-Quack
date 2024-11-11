import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react"; // Importing Star for rating display
import Loading from "../components/shared/Loading";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Check,
  ChevronsUpDown,
  Star,
  Ticket,
  Users,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Loading from "@/components/shared/Loading";
import { ShareButton } from "@/components/shared/ShareButton";

export default function SingleActivityPage() {
  const { prefCurrency } = useUser();
  const { toast } = useToast();
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [ticketCount, setTicketCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const ticketNumbers = Array.from({ length: 50 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const fetchActivity = async () => {
    try {
      const response = await axios.get(
        `/api/activity/activityDetails/${id}?currency=${prefCurrency}`
      );
      setActivity(response.data);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [id, prefCurrency]);

  if (!activity) {
<<<<<<< HEAD
    return <div className="flex justify-center mt-10"><Loading /></div>;
=======
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <Loading size="xl" />
      </div>
    );
>>>>>>> 80c5c2fd2d93a1c92ab7efca87a54d037ce59946
  }

  const {
    name,
    coverImagePath,
    category,
    date,
    location,
    googlemaps,
    price,
    minPrice,
    maxPrice,
    priceType,
    rating,
    booking,
    discounts,
    tickets,
    tags,
  } = activity;

  const handleBooking = async () => {
    try {
      const response = await axios.post(
        `/api/booking/bookEvent/6725442e98359339d8b821f0`,
        {
          eventType: "activity",
          date: time,
          eventID: id,
          payByWallet: false,
          numOfTickets: ticketCount,
        }
      );

      toast({
        description: "Quack-tastic! Your booking is confirmed!",
        variant: "success",
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      toast({
        description: "Oops! Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateTotalPrice = () => {
    const pricePerTicket = priceType === "fixed" ? price : selectedPrice;
    return pricePerTicket * ticketCount;
  };

  return (
<<<<<<< HEAD
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 min-h-screen">
      <img className="w-full rounded-lg shadow-lg mb-4" src={img} alt={name} />
      <h1 className="font-semibold text-3xl text-gray-800 mb-2">{name}</h1>
      <span className="text-gold text-xl">{category}</span>
      <h4 className="text-base text-gray-600 mb-2">
        {new Date(time).toDateString()} {new Date(time).toLocaleTimeString()}
      </h4>
      <h4 className="text-base text-gray-600 mb-2">{location}</h4>
      <h4 className="flex items-center mb-4">
        <span className="text-xl text-skyblue">
          EGP {priceType === "fixed" ? price : `${minPrice} - ${maxPrice}`}
        </span>
        <span className="flex items-center ml-4">
          <b className="mr-1">Rating:</b> {rating} <Star className="ml-1" color="#E7B008" />
        </span>
      </h4>
      <h4 className="text-base text-gray-600 mb-2">
        <b className="mr-2">Booking:</b>
        {booking ? "Open" : "Closed"}
      </h4>
      <div className="flex flex-col gap-2 mb-4">
        {Array.isArray(discounts) && discounts.map((discount, index) => (
          <p key={index} className="text-base text-red-700">
            {discount}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap mb-4">
        {Array.isArray(tags) && tags.map((tag) => (
          <span key={tag._id} className="text-gray-500 ml-2 text-base border-b border-gray-300">
            #{tag.name}
          </span>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <iframe
          className="w-full h-64 rounded-lg"
          src={googlemaps}
          title="Location Map"
          frameBorder="0"
          allowFullScreen
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
=======
    <div className="flex flex-col items-center justify-center p-4 bg-blue-50 min-h-screen">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="relative">
              <img
                className="w-full h-64 object-cover"
                src={coverImagePath}
                alt={name}
              />
              <div className="absolute inset-0 bg-yellow-400 opacity-20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <h1 className="font-bold text-4xl text-white mb-2">{name}</h1>
                <span className="text-yellow-300 text-xl">{category}</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between">
                <div className="flex items-center mb-4 text-gray-600">
                  <Calendar className="mr-2" />
                  <span>{new Date(date).toLocaleString()}</span>
                </div>
                <ShareButton title={name} link={window.location.href} />
              </div>

              <div className="flex items-center mb-4 text-gray-600">
                <Users className="mr-2" />
                <span>{location}</span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-blue-600">
                  {prefCurrency}{" "}
                  {priceType === "fixed" ? price : `${minPrice} - ${maxPrice}`}
                </span>
              </div>

              {priceType === "range" && (
                <RadioGroup
                  value={selectedPrice.toString()}
                  onValueChange={(value) => setSelectedPrice(Number(value))}
                  className="grid gap-4 mb-6"
                >
                  <Label className="text-lg font-semibold mb-2">
                    Choose Your Quack Pack:
                  </Label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RadioGroupItem
                      value={minPrice.toString()}
                      id="standard"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="standard"
                      className="flex items-center p-4 bg-green-100 rounded-lg cursor-pointer transition-all hover:bg-green-200 peer-checked:ring-2 peer-checked:ring-green-500"
                    >
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          Duckling Pack
                        </CardTitle>
                        <CardDescription>
                          Perfect for solo adventurers
                        </CardDescription>
                        <span className="block mt-2 text-lg font-bold text-green-700">
                          {prefCurrency} {minPrice}
                        </span>
                      </div>
                    </Label>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RadioGroupItem
                      value={maxPrice.toString()}
                      id="premium"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="premium"
                      className="flex items-center p-4 bg-blue-100 rounded-lg cursor-pointer transition-all hover:bg-blue-200 peer-checked:ring-2 peer-checked:ring-blue-500"
                    >
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          Mighty Duck Pack
                        </CardTitle>
                        <CardDescription>
                          For the ultimate quack experience
                        </CardDescription>
                        <span className="block mt-2 text-lg font-bold text-blue-700">
                          {prefCurrency} {maxPrice}
                        </span>
                      </div>
                    </Label>
                  </motion.div>
                </RadioGroup>
              )}

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
                                setTicketCount(parseInt(currentValue));
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

              {Array.isArray(discounts) && discounts.length > 0 && (
                <div className="mb-6">
                  <Label className="text-lg font-semibold mb-2">
                    Quack-tastic Deals:
                  </Label>
                  {discounts.map((discount, index) => (
                    <p
                      key={index}
                      className="text-base text-green-600 flex items-center"
                    >
                      <Ticket className="mr-2" />
                      {discount}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold">Total Quack Value:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {prefCurrency} {calculateTotalPrice()}
                </span>
              </div>

              <Button
                onClick={handleBooking}
                size="lg"
                className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-500 transition-colors"
              >
                Quack Now to Book!
              </Button>
            </div>
>>>>>>> 80c5c2fd2d93a1c92ab7efca87a54d037ce59946
          </div>
        </div>
        );
}
