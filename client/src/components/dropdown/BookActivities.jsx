import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Loader2,
  Users,
  Ticket,
  Star,
  DollarSign,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isFuture } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import DeleteButton from "../shared/DeleteButton";

export default function BookActivities() {
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [pastActivities, setPastActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id;

  const fetchBookedActivities = async () => {
    try {

      const response = await axios.post("/api/tourist/myBookings/ ", {
        eventType: "activity",
      });
      const allActivities = response.data.filter(
        (activity) => activity != null
      );
      const now = new Date();
      const upcoming = allActivities.filter((activity) =>
        isFuture(new Date(activity.activityID.date))
      );
      const past = allActivities.filter(
        (activity) => !isFuture(new Date(activity.activityID.date))
      );

      setUpcomingActivities(upcoming);
      setPastActivities(past);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booked activities:", error);
      setLoading(false);
    }
  };

  const cancelBooking = async (activityID) => {
    try {
      await axios.post(`/api/booking/cancelBooking/`, {
        eventType: "activity",
        eventID: activityID,
      });
      setUpcomingActivities((prev) =>
        prev.filter((act) => act._id !== activityID)
      );
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const isCancellable = (activityDate) => {
    const now = new Date();
    const activityTime = new Date(activityDate);
    const hoursDifference = (activityTime - now) / (1000 * 60 * 60);
    return hoursDifference >= 48;
  };

  useEffect(() => {
    fetchBookedActivities();
  }, [id]);

  const renderActivityCards = (activities) => (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
        {activities.map((activity, index) => (
          <motion.div
            key={activity._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="relative h-48">
                <img
                  src={
                    activity.activityID.coverImagePath ||
                    "/placeholder.svg?height=192&width=384"
                  }
                  alt={activity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <CardTitle className="absolute bottom-2 left-2 text-white text-xl font-bold">
                  {activity.name}
                </CardTitle>
                <Badge className="absolute top-2 right-2 bg-yellow-400 text-blue-900">
                  {isFuture(new Date(activity.activityID.date))
                    ? "Upcoming"
                    : "Past"}
                </Badge>
              </div>
              <CardContent className="flex-grow p-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                    <span>
                      Booked: {format(new Date(activity.createdAt), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-green-500" />
                    <span>
                      Event: {format(new Date(activity.activityID.date), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-red-500" />
                    <span>{activity.activityID.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{activity.price}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Ticket className="mr-2 h-4 w-4 text-purple-500" />
                    <span>{activity.numOfTickets} Tickets</span>
                  </div>
                  {activity.specialDiscounts &&
                    activity.specialDiscounts.length > 0 && (
                      <div className="bg-green-100 text-green-800 p-2 rounded-md text-sm mt-2">
                        <Star className="inline-block mr-2 h-4 w-4" />
                        Special Discounts:{" "}
                        {activity.specialDiscounts.join(", ")}
                      </div>
                    )}
                </div>
              </CardContent>
              {isFuture(new Date(activity.activityID.date)) && (
                <CardFooter className="bg-gray-50 p-4">
                  <DeleteButton
                    variant={
                      isCancellable(activity.activityID.date)
                        ? "destructive"
                        : "secondary"
                    }
                    className="w-full transition-all duration-300 hover:shadow-md"
                    onConfirm={() => cancelBooking(activity._id)}
                    disabled={!isCancellable(activity.activityID.date)}
                  >
                    {isCancellable(activity.activityID.date)
                      ? "Cancel Booking"
                      : "Cannot Cancel Within 48 Hours"}
                  </DeleteButton>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Quack-tastic Adventures
      </motion.h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : upcomingActivities.length === 0 && pastActivities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-r from-yellow-100 to-blue-100">
            <CardContent>
              <p className="text-center text-xl text-blue-800">
                No booked activities yet. Time to plan your next duck-venture!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming" className="text-lg">
              Upcoming Quack-tivities
            </TabsTrigger>
            <TabsTrigger value="past" className="text-lg">
              Past Quack-ventures
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            {upcomingActivities.length === 0 ? (
              <Card className="p-6 bg-gradient-to-r from-yellow-100 to-green-100">
                <CardContent>
                  <p className="text-center text-xl text-green-800">
                    No upcoming activities. Time to plan your next duck-venture!
                  </p>
                </CardContent>
              </Card>
            ) : (
              renderActivityCards(upcomingActivities)
            )}
          </TabsContent>
          <TabsContent value="past">
            {pastActivities.length === 0 ? (
              <Card className="p-6 bg-gradient-to-r from-blue-100 to-purple-100">
                <CardContent>
                  <p className="text-center text-xl text-purple-800">
                    No past activities. Your duck-ventures are just beginning!
                  </p>
                </CardContent>
              </Card>
            ) : (
              renderActivityCards(pastActivities)
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
