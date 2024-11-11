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
export default function activityCard(props) {
  const navigate = useNavigate();
  const { prefCurrency } = useUser();
  const date = new Date(props.time);
  const openActivityPage = () => {
    console.log(props.id)
    navigate(`/activity/${props.activityID}`);
  };
  return (
    <div
<<<<<<< HEAD
      onClick={openActivityPage}
      className="shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400 hover:cursor-pointer w-[450px] h-[570px] rounded-xl"
=======
      onClick={props.booking ? openActivityPage : undefined}
      className="container rounded-lg w-[25rem] h-auto p-2 shadow-md"
>>>>>>> 80c5c2fd2d93a1c92ab7efca87a54d037ce59946
    >
      <img className=" rounded-lg rounded-b-none h-[300px] w-full object-fill" src={props.img} />
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
          <h1 className=" flex">
            {" "}
            <span className="font-semibold text-xl mr-auto">{props.name} </span>
            {/* {!props.booking && (
              <Activity
                size={36}
                className="border border-red-600 rounded-full bg-red-600 text-white p-1"
              />
            )} */}
            <span className="text-gold drop-shadow">{props.category}</span>
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

<<<<<<< HEAD

          <p className="text-base">
            <b className="mr-2">Booking:</b>
            {props.booking ? "Open" : "Closed"}
          </p>
          <div className="flex flex-col justify-between gap-2">

            <div className="flex justify-between">
              <Label className="font-semibold text-lg text-skyblue">
                Price: {props.priceType == "fixed"
                  ? props.price
                  : `${props.minPrice} - ${props.maxPrice}`}
              </Label>

              <Rating rating={props.rating} numberOfReviews={props.numberOfReviews} />
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
=======
        <h4 className="flex">
          {" "}
          <span className="text-base text-skyblue drop-shadow mr-auto">
            {prefCurrency}{" "}
            {props.priceType == "fixed"
              ? props.price
              : `${props.minPrice} - ${props.maxPrice}`}{" "}
          </span>
          <span className="flex">
            <b className="mr-1">Rating:</b> {props.rating}{" "}
            <Star className="ml-1" color=" #E7B008" />
          </span>
        </h4>
        <h4 className="text-base">
          {" "}
          <b className="mr-2">Booking:</b>
          {props.booking ? "Open" : "Closed"}
        </h4>
        <div className="flex flex-row justify-between gap-4">
          <div className="flex flex-col gap-y-0">
            {" "}
            {Array.isArray(props.discounts) &&
              props.discounts.map((discount) => (
                <p key={discount} className="text-base text-red-700 ">
                  {discount}
                </p>
              ))}
          </div>
          <div className="text-right">
            {Array.isArray(props.tags) &&
              props.tags.map((tag) => (
                <span key={tag._id} className="text-gray-500 ml-2">
                  #{tag.name}
                </span>
>>>>>>> 80c5c2fd2d93a1c92ab7efca87a54d037ce59946
              ))}
            </div>

          </div>
        </div >
      </div >
    </div >
  );
}
