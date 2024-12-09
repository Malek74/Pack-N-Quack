/* eslint-disable react/prop-types */
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import Maps from "../shared/Maps";
import ActivityEditForm from "../forms/ActivityEditForm";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Rating } from "../shared/Rating";
import { Label } from "../ui/label";
//import Activity from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import axios from "axios";
export default function ActivityCard(props) {
  const navigate = useNavigate();
  const { prefCurrency } = useUser();
  const { userId } = useUser();
  const date = new Date(props.time);
  const openActivityPage = () => {
    console.log(props.activityID);
    console.log(props.booking);
    navigate(`/activity/${props.activityID}`);
  };
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = async (e, id) => {
    e.stopPropagation();
    console.log("Bookmark clicked");
    setIsBookmarked(!isBookmarked);

    try {
      const response = await axios.post("/api/tourist/save", {
        eventID: id,
        bookmark: !isBookmarked,
        eventType: "activity",
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className="shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400 hover:cursor-pointer w-[450px] h-[570px] rounded-xl"
      onClick={() => {
        props.booking && openActivityPage();
      }}
    >
      <img
        className=" rounded-lg rounded-b-none h-[300px] w-full object-fill"
        src={props.img}
      />
      <div className="flex place-content-end ">
        {props.notTourist && (
          <>
            <Button
              onClick={() => props.deleteActivityFunction(props.activityID)}
              className="w-14 absolute bg-transparent "
            >
              <Trash2 />
            </Button>
            <Button className="w-14 mx-10 absolute bg-transparent ">
              <ActivityEditForm
                type="act"
                name={props.name}
                time={date}
                location={props.location}
                mapsSrc={props.googlemaps}
                category={props.category}
                minPrice={props.minPrice}
                maxPrice={props.maxPrice}
                price={props.price}
                priceType={props.priceType}
                tags={props.tags}
                booking={props.booking}
                discounts={props.discounts}
                activityID={props.activityID}
                updateActivityFunction={props.updateActivityFunction}
              />
            </Button>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <h1 className=" flex items-center">
            {" "}
            <span className="font-semibold text-xl mr-auto">{props.name} </span>
            {/* {!props.booking && (
              <Activity
                size={36}
                className="border border-red-600 rounded-full bg-red-600 text-white p-1"
              />
            )} */}
            <span className="text-gold drop-shadow">{props.category}</span>
            <Bookmark
              fill={isBookmarked ? "gold" : "white"}
              size={36}
              className="text-gold hover:text-goldhover ml-4"
              onClick={(e) => handleBookmark(e, props.activityID)}
            />
          </h1>

          <p className="text-base">
            {date.toDateString() + " " + date.toLocaleTimeString()}
          </p>
          <p className="text-base">
            {props.location}{" "}
            <span className="ml-2">
              {" "}
              <Maps mapsSrc={props.googlemaps}></Maps>{" "}
            </span>
            <br />
          </p>

          <p className="text-base">
            <b className="mr-2">Booking:</b>
            {props.booking ? "Open" : "Closed"}
          </p>
          <div className="flex flex-col justify-between gap-2">
            <div className="flex justify-between">
              <Label className="font-semibold text-lg text-skyblue">
                Price:{" "}
                {props.priceType == "fixed"
                  ? props.price
                  : `${props.minPrice} - ${props.maxPrice}`}
              </Label>

              <Rating
                rating={props.rating}
                numberOfReviews={props.numberOfReviews}
              />
            </div>
            <div className="flex flex-col gap-y-0">
              {Array.isArray(props.discounts) &&
                props.discounts.map((discount) => (
                  <p key={discount} className="text-base text-red-700 ">
                    {discount}
                  </p>
                ))}
            </div>
            <div className="flex gap-2">
              {props.tags.map((t) => (
                <Label
                  key={t._id}
                  className="text-sm text-gray-500 border-gray-500 rounded-full border px-2"
                >
                  {`#${t.name}`}
                </Label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
