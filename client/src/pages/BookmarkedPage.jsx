import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import axios from "axios";
import { useEffect, useState } from "react";
import ActivityCard from "@/components/activityPage/ActivityCard";
import ItinerariesCard from "@/components/itinerariesPage/ItinerariesCard";
import Loading from "@/components/shared/Loading";
export default function BookmarkedPage() {

    const [savedActivities, setSavedActivities] = useState([]);
    const [savedItineraries, setSavedItineraries] = useState([]);

    const [loading, setLoading] = useState();

    const fetchBookmarked = async () => {
        try {
            setLoading(true);
            const response = await axios.get('api/tourist/viewbookmark');
            setSavedActivities(response.data.savedActivities);
            setSavedItineraries(response.data.savedItineraries);
            console.log(response.data);
            console.log(savedActivities);
            console.log(savedItineraries);
        } catch (error) {
            console.error('Error fetching saved places:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        //   fetchSavedActivities();
        fetchBookmarked();
    }, [])
    return (

        <Tabs defaultValue="places" className="w-auto ">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            <TabsContent value="itineraries">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center mt-12">Bookmarked Itineraries</CardTitle>
                        <CardDescription className="self-center mt-10">
                            {loading && <Loading />}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <div className="grid grid-rows justify-evenly mt-12 self-center gap-y-10 px-10">

                            {savedItineraries?.map((itinerary) => (
                                <ItinerariesCard
                                    key={itinerary._id}
                                    id={itinerary._id}
                                    image={itinerary.image}
                                    name={itinerary.name}
                                    description={itinerary.description}
                                    tags={itinerary.tags}
                                    price={itinerary.price}
                                    rating={itinerary.ratings.averageRating}
                                    numberOfReviews={itinerary.ratings.reviews.length}
                                    coverImage={itinerary.coverImage || null}
                                    touristClicked={true}
                                    small={true}

                                />
                            ))}
                        </div>

                    </CardContent>

                </Card>
            </TabsContent>
            <TabsContent value="activities">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center mt-12">Bookmarked Activities</CardTitle>
                        <CardDescription className="self-center mt-10">
                            {loading && <Loading />}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-rows justify-evenly mt-12 self-center gap-y-10 px-10">
                            {savedActivities.map((activity) => (
                                <ActivityCard
                                    key={activity._id}
                                    img={activity.coverImagePath}
                                    name={activity.name}
                                    category={activity.categoryID.name}
                                    time={activity.date}
                                    location={activity.location}
                                    googlemaps={activity.googleMapLink}
                                    priceType={activity.priceType}
                                    minPrice={activity.minPrice}
                                    maxPrice={activity.maxPrice}
                                    price={activity.price}
                                    tags={activity.tags}
                                    notTourist={false}
                                    booking={activity.isBookingOpen}
                                    discounts={activity.specialDiscounts}
                                    rating={activity.ratings.averageRating}
                                    numberOfReviews={activity.ratings.reviews.length}
                                    activityID={activity._id}
                                />
                            ))}
                        </div>


                    </CardContent>

                </Card>
            </TabsContent>
        </Tabs>
    )
}

