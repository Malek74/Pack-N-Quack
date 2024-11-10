import PropTypes from "prop-types";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Rating } from "../shared/Rating";
import { useNavigate } from "react-router-dom";
import { Activity, FlagOff } from "lucide-react";

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
  isFlagged = false,
  isActive = true,
}) {
  const navigate = useNavigate();
  return (
    <Card
      className="shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400 hover:cursor-pointer w-[550px] h-[450px]"
      onClick={() => {
        if (touristClicked) navigate(`/itinerariesTourists/${id}`);
        if (tourGuideClicked) navigate(`/itinerariesTourGuide/${id}`);
      }}
    >
      <img
        src={
          coverImage ||
          "https://media.istockphoto.com/id/1406854851/vector/travel-time-vector-background-design-time-to-travel-text-in-blue-space-with-3d-tourist.jpg?s=612x612&w=0&k=20&c=GMlx-8LNNhoQdE4cbKwu2apsLcmmTKj5pq77ToAu8BM%3D"
        }
        className="rounded-lg rounded-b-none h-[300px] w-full object-fill"
      />
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label className="text-lg font-semibold">{name}</Label>
            <div className="flex gap-2">
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
              Price: {price}
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
