import Booking from "../models/bookingSchema";
import Itinerary from "../models/itinerarySchema";
import Activity from "../models/activitySchema";
import Tourist from "../models/touristSchema";
import advertiserModel from "../models/advertiserSchema";
import tourGuide from "../models/tourGuideSchema"

export const flaggedEvents = async (req, res) => {
    const { eventId, userId } = req.body;
    
    try {
        const userExist = await Tourist.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        let eventExist = await Itinerary.findById(eventId);
        if (!eventExist) {
            eventExist = await Activity.findById(eventId);
            if (!eventExist) {
                return res.status(404).json({ message: "Event doesn't exist" });
            }
        }

        const bookingExist = await Booking.findOne({touristID: userId, $or: [{ itineraryID: eventId }, { activityID: eventId }] });

        if (!bookingExist) {
            return res.status(404).json({ message: "This tourist did not book this event" });
        }

        if (eventExist.flagged) {
            userExist.wallet += eventExist.price;
            await userExist.save(); 
        }

        return res.status(200).json({ message: "Sorry for the inconvenience, the money has been refunded" });

    } catch (error) {
        console.error("Error processing flagged events:", error); 
        return res.status(500).json({ message: error.message });
    }
};



export const requestDeleteAccount = async (req, res) => {
    const { userId, userType } = req.body;

    let userModel;

  
    switch (userType) {
        case 'Advertiser':
            userModel = advertiserModel;
            break;
        case 'Tourist':
            userModel = Tourist;
            break;
        case 'Tour Guide':
            userModel = tourGuide;
            break;
        default:
            return res.status(400).json({ message: "Invalid user type" });
    }

    try {
        const userExist = await userModel.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        if (userModel === Tourist) {
            const hasBooking = await Booking.findOne({ touristID: userId });
            if (hasBooking && !hasBooking.status=='cancelled' ) {
                return res.status(400).json({ message: "You cannot delete your account because you have booked an upcoming event" });
            }
        } else if (userModel === tourGuide) {
            const joinedItinerary = await Itinerary.findOne({ tourGuideID: userId });
            if (joinedItinerary && joinedItinerary.isActive==true && !joinedItinerary.flagged) {
                return res.status(400).json({ message: "You cannot delete your account because you are assigned to an upcoming event" });
            }
        } else { 
            const joinedActivity = await Activity.findOne({ advertiserID: userId });
            if (joinedActivity && !joinedActivity.flagged) {
                return res.status(400).json({ message: "You cannot delete your account because you are assigned to an upcoming event" });
            }
        }
        await userModel.findByIdAndDelete(userId);
        return res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error("Error processing account deletion:", error);
        return res.status(500).json({ message: error.message });
    }
};
