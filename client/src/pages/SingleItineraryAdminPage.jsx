import ImageSlideshow from "@/components/shared/ImageSlideshow";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import Loading from "@/components/shared/Loading";
import { Rating } from "@/components/shared/Rating";
import { format } from "date-fns";
import ItineraryActivitySlideShow from "@/components/ItinerariesPage/ItineraryActivitySlideShow";
import Maps from "@/components/shared/Maps";
import { Flag, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

export default function SingleItineraryAdminPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState(true);
  const [fetchedItinerary, setFetchedItinerary] = useState({});
  const [itineraryFlag, setItineraryFlag] = useState();
  const navigate = useNavigate();
  const { prefCurrency } = useUser();
  const toggleFlagItinerary = async (value) => {
    try {
      await axios.put(`/api/itinerary/flag/${id}`, {
        flag: value,
      });
      setItineraryFlag(value);
      toast({
        title: "Success",
        description: "Itinerary flagged successfully",
        variant: "success",
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
  const handleToggleFlag = () => {
    toggleFlagItinerary(!itineraryFlag);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/itinerary/${id}`);
      toast({
        variant: "success",
        title: "Success",
        description: "Itinerary deleted successfully",
      });
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: error.response.data.message,
        description: error.response.data.error,
      });
    }
  };

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/itinerary/viewItinerary/${id}`, {
          params: { currency: prefCurrency },
        });
        console.log(response.data);
        setFetchedItinerary(response.data);
        setItineraryFlag(response.data.flagged);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItinerary();
  }, [id, prefCurrency]);

  return (
    (isloading && (
      <div className="flex justify-center items-center h-[80vh]">
        <Loading size="xl" />
      </div>
    )) || (
      <div className="flex flex-col w-screen gap-8">
        <ImageSlideshow images={fetchedItinerary.images} />
        <div className="flex justify-between px-28">
          <div className="flex flex-col w-[60%] gap-6">
            <div className="flex justify-between">
              <Label className="text-3xl font-bold">
                {fetchedItinerary.name}
              </Label>
              <div className="flex justify-end gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Flag
                        size={42}
                        className={
                          !itineraryFlag
                            ? "border border-green-500 rounded-full bg-green-500 text-white p-1 hover:bg-green-600 hover:border-green-600"
                            : "border border-red-600 rounded-full bg-red-600 text-white p-1 hover:bg-red-700 hover:border-red-700"
                        }
                        onClick={() => {
                          handleToggleFlag();
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-lg">
                        {!itineraryFlag
                          ? "The itinerary is not flagged, Click to toggle"
                          : "The itinerary is flagged, Click to toggle"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <AlertDialog>
                  <AlertDialogTrigger className="">
                    <Trash2
                      size={42}
                      className={
                        "border border-red-600 rounded-full bg-red-600 text-white p-1 hover:bg-red-700 hover:border-red-700"
                      }
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Quack Goodbye to This Itinerary?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to quack this itinerary goodbye?
                        Once it’s gone, it won’t waddle back!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => {
                          handleDelete(); // Corrected typo
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <p className="text-lg text-neutral-600">
              {fetchedItinerary.description}
            </p>
            <div className="flex gap-2">
              {fetchedItinerary.tags.map((t) => (
                <Label
                  key={t._id}
                  className="text-sm text-gray-500 border-gray-500 rounded-full border px-2"
                >
                  {`#${t.tag}`}
                </Label>
              ))}
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-4">
                <Label className="text-2xl font-bold">Available Dates</Label>
                <div className="flex gap-4">
                  {fetchedItinerary.available_dates.map((date, index) => (
                    <span
                      key={index}
                      className="text-lg bg-gold p-1 px-4 text-white rounded-full"
                    >
                      {format(date, "PPP")}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Label className="text-2xl font-bold">Price</Label>
                <p className="text-lg font-bold bg-gold p-1 px-4 text-white rounded-full">
                  {`${fetchedItinerary.price} EGP`}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-1 w-[40%]">
                <Label className="text-2xl font-bold">Pick-Up Location</Label>
                <div className="flex justify-between">
                  <p className="text-lg text-neutral-600">
                    {fetchedItinerary.pickUpLocation.name}
                  </p>
                  <Maps
                    mapsSrc={fetchedItinerary.pickUpLocation.googleMapLink}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[40%]">
                <Label className="text-2xl font-bold">Drop-Off Location</Label>
                <div className="flex justify-between">
                  <p className="text-lg text-neutral-600">
                    {fetchedItinerary.dropOffLocation.name}
                  </p>
                  <Maps
                    mapsSrc={fetchedItinerary.dropOffLocation.googleMapLink}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label className="text-3xl font-bold">Meet the Tour Guide</Label>
            <div className="flex items-center justify-around gap-4">
              <img
                src="https://thumbs.dreamstime.com/b/cute-kawaii-duck-emoji-icon-vector-cute-kawaii-duck-emoji-icon-vector-illustration-318282907.jpg"
                className="w-24 h-24 rounded-full border-2 border-gray-400 p-4"
              />
              <div className="flex flex-col gap-2">
                <Label className="text-2xl font-semibold">
                  {fetchedItinerary.tourGuideID.username}
                </Label>
                <Rating
                  rating={fetchedItinerary.tourGuideID.ratings.averageRating}
                  numberOfReviews={
                    fetchedItinerary.tourGuideID.ratings.reviews.length
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-2xl font-bold">Accessibility</Label>
              <p className="text-lg text-neutral-600">
                {fetchedItinerary.accessibility}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-2xl font-bold">Language</Label>
              <p className="text-lg text-neutral-600">
                {fetchedItinerary.language}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Label className="text-3xl font-bold">Daily Activities</Label>
        </div>
        <div className="grid grid-cols-2 gap-8 px-28">
          {fetchedItinerary.days.map((activity) => (
            <div key={activity.day} className="flex flex-col gap-4 rounded-lg">
              <Label className="text-xl font-bold">Day {activity.day}</Label>
              <ItineraryActivitySlideShow cardData={activity.activities} />
            </div>
          ))}
        </div>
      </div>
    )
  );
}
