import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/shared/Loading";
import BookedItineraryCard from "@/components/ItinerariesPage/BookedItineraryCard";
import { isFuture } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
export default function ItineraryBookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingItineraries, setUpcomingItineraries] = useState([]);
  const [pastItineraries, setPastItineraries] = useState([]);
  const fetchItineraries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/tourist/myBookings", {
        eventType: "itinerary",
      });
      const allItineraries = response.data.filter(
        (activity) => activity != null
      );
      const upcoming = allItineraries.filter((activity) =>
        isFuture(new Date(activity.date))
      );
      const past = allItineraries.filter(
        (activity) => !isFuture(new Date(activity.date))
      );

      setUpcomingItineraries(upcoming);
      setPastItineraries(past);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchItineraries();
  }, []);

  return isLoading ? (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Loading size="xl" />
    </div>
  ) : upcomingItineraries.length === 0 && pastItineraries.length === 0 ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gradient-to-r from-yellow-100 to-blue-100">
        <CardContent>
          <p className="text-center text-xl text-blue-800">
            No booked itineraries yet. Time to plan your next duck-venture!
          </p>
        </CardContent>
      </Card>
    </motion.div>
  ) : (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <div className="min-h-screen w-full grid grid-cols-2 gap-4 mt-6">
          {upcomingItineraries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-r from-yellow-100 to-blue-100">
                <CardContent>
                  <p className="text-center text-xl text-blue-800">
                    No upcoming itineraries. Time to plan your next
                    duck-venture!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {upcomingItineraries.map((itinerary) => (
            <BookedItineraryCard
              key={itinerary.itineraryID._id}
              id={itinerary.itineraryID._id}
              image={itinerary.itineraryID.image}
              name={itinerary.itineraryID.name}
              description={itinerary.itineraryID.description}
              tags={itinerary.itineraryID.tags}
              price={itinerary.itineraryID.price}
              rating={itinerary.itineraryID.ratings.averageRating}
              numberOfReviews={itinerary.itineraryID.ratings.reviews.length}
              coverImage={itinerary.itineraryID.coverImage || null}
              eventDate={itinerary.date}
              bookingDate={itinerary.createdAt}
              numOfTickets={itinerary.numOfTickets}
              bookingId={itinerary._id}
              onCancel={fetchItineraries}
            />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="past">
        <div className="min-h-screen w-full grid grid-cols-2 gap-4 mt-6">
          {pastItineraries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-r from-yellow-100 to-blue-100">
                <CardContent>
                  <p className="text-center text-xl text-blue-800">
                    No past itineraries. Time to plan your next duck-venture!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {pastItineraries.map((itinerary) => (
            <BookedItineraryCard
              key={itinerary.itineraryID._id}
              id={itinerary.itineraryID._id}
              image={itinerary.itineraryID.image}
              name={itinerary.itineraryID.name}
              description={itinerary.itineraryID.description}
              tags={itinerary.itineraryID.tags}
              price={itinerary.itineraryID.price}
              rating={itinerary.itineraryID.ratings.averageRating}
              numberOfReviews={itinerary.itineraryID.ratings.reviews.length}
              coverImage={itinerary.itineraryID.coverImage || null}
              eventDate={itinerary.date}
              bookingDate={itinerary.createdAt}
              numOfTickets={itinerary.numOfTickets}
              bookingId={itinerary._id}
              past
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
