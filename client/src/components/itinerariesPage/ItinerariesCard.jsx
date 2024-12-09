import PropTypes from "prop-types";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Rating } from "../shared/Rating";
import { useNavigate } from "react-router-dom";
import { Activity, FlagOff, Bookmark } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import axios from "axios";

ItinerariesCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.array,
  price: PropTypes.number,
  rating: PropTypes.number,
  numberOfReviews: PropTypes.number,
  coverImage: PropTypes.string,
  touristClicked: PropTypes.bool,
  isFlagged: PropTypes.bool,
  isActive: PropTypes.bool,
  tourGuideClicked: PropTypes.bool,
  small: PropTypes.bool,
  adminClicked: PropTypes.bool,
};
export default function ItinerariesCard({
  id,
  name,
  description,
  tags,
  price,
  rating,
  numberOfReviews,
  coverImage,
  touristClicked,
  tourGuideClicked,
  adminClicked,
  isFlagged = false,
  isActive = true,
  small = false,
}) {
  const navigate = useNavigate();
  const cardClassName = small
    ? "shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400 hover:cursor-pointer w-[450px] h-[350px]"
    : "shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400 hover:cursor-pointer w-[550px] h-[450px]";
  const imgClassName = small
    ? "rounded-lg rounded-b-none h-[200px] w-full object-fill"
    : "rounded-lg rounded-b-none h-[300px] w-full object-fill";

  const { prefCurrency } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const handleBookmark = async (e) => {
    e.stopPropagation();
    console.log("Bookmark clicked");
    setIsBookmarked(!isBookmarked);

    try {
      const response = await axios.post("/api/tourist/save", {
        eventID: id,
        bookmark: !isBookmarked,
        eventType: "itinerary",
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Card
      //  className="shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400 hover:cursor-pointer w-[450px] h-[450px] "
      className={cardClassName}
      onClick={() => {
        if (touristClicked) navigate(`/itinerariesTourists/${id}`);
        if (tourGuideClicked) navigate(`/itinerariesTourGuide/${id}`);
        if (adminClicked) navigate(`/itinerariesAdmin/${id}`);
      }}
    >
      <img
        src={
          coverImage ||
          "https://media.istockphoto.com/id/1406854851/vector/travel-time-vector-background-design-time-to-travel-text-in-blue-space-with-3d-tourist.jpg?s=612x612&w=0&k=20&c=GMlx-8LNNhoQdE4cbKwu2apsLcmmTKj5pq77ToAu8BM%3D"
        }
        className={imgClassName}
      />
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label className="text-lg font-semibold">{name}</Label>

            <div className="flex gap-2">
              {touristClicked && (
                <Bookmark
                  fill={isBookmarked ? "gold" : "white"}
                  size={36}
                  className="text-gold hover:text-goldhover"
                  onClick={(e) => handleBookmark(e)}
                />
              )}
              {isFlagged && (
                <FlagOff
                  size={36}
                  className="border border-red-600 rounded-full bg-red-600 text-white p-1"
                />
              )}
              {!isActive && (
                <Activity
                  size={36}
                  className="border border-red-600 rounded-full bg-red-600 text-white p-1"
                />
              )}
            </div>
          </div>
          <p className="text-sm text-neutral-400 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {description}
          </p>
          <div className="flex justify-between">
            <Label className="font-semibold text-lg text-gray-500">
              {`Price: ${price} ${adminClicked ? "USD" : prefCurrency}`}
            </Label>

            <Rating rating={rating} numberOfReviews={numberOfReviews} />
          </div>
          <div className="flex gap-2">
            {tags.map((t) => (
              <Label
                key={t._id}
                className="text-sm text-gray-500 border-gray-500 rounded-full border px-2"
              >
                {`#${t.tag}`}
              </Label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
