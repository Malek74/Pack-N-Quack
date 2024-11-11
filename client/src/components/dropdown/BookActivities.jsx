import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Loader2, Users, Ticket, Star } from "lucide-react";
import { DollarSign } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area";export default function BookActivities() {
  const [bookedActivities, setBookedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id;

  const fetchBookedActivities = async () => {
    try {
      const response = await axios.post("/api/tourist/myBookings/6725442e98359339d8b821f0", { eventType: "activity" });
      setBookedActivities(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booked activities:", error);
      setLoading(false);
    }
  };

  const cancelBooking = async (activityID) => {
    try {
      await axios.post(`/api/booking/cancelBooking/6725442e98359339d8b821f0`, {
        eventType: "activity",
        eventID: activityID,
      });
      setBookedActivities((prev) => prev.filter((act) => act?._id !== activityID));
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Quack-tastic Adventures</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : bookedActivities.length === 0 ? (
        <Card className="p-6">
          <CardContent>
            <p className="text-center text-xl">No booked activities yet. Time to plan your next duck-venture!</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {bookedActivities.map((activity) =>
              activity ? ( // Check if activity is not null
                <Card key={activity._id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <img src={activity.activityID.coverImagePath || "/placeholder.svg?height=192&width=384"} alt={activity.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <CardTitle className="absolute bottom-2 left-2 text-white text-xl font-bold">{activity.name}</CardTitle>
                  </div>
                  <CardContent className="flex-grow">
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Booked:  {new Date(activity.date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Event:  {activity.activityID.date}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{activity.activityID.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>{activity.price}</span>
          </div>
                      <div className="flex items-center text-sm">
                        <Ticket className="mr-2 h-4 w-4" />
                        <span> {activity.numOfTickets} Tickets</span>
                      </div>
                      {/* <div className="flex items-center text-sm">
                        <Star className="mr-2 h-4 w-4" />
                        <span>Average Rating: {activity.ratings?.averageRating || 'N/A'}</span>
                      </div> */}
                      {activity.specialDiscounts && activity.specialDiscounts.length > 0 && (
                        <div className="text-green-600">
                          Special Discounts: {activity.specialDiscounts.join(", ")}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                     <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => cancelBooking(activity._id)}
                      disabled={!isCancellable(activity.activityID.date)} // Disable if within 48 hours
                    >
                      {isCancellable(activity.activityID.date) ? "Cancel Booking" : "Cannot Cancel Within 48 Hours"}
                    </Button>
                  </CardFooter>
                </Card>
              ) : null // Skip rendering if activity is null
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
