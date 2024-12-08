import { Button } from "../ui/button";
import { Trash2 } from 'lucide-react';
import Maps from "../shared/Maps";
import PlaceEditForm from "../forms/PlaceEditForm";
import { useNavigate } from "react-router-dom";
import { Rating } from "../shared/Rating";
import { Label } from "../ui/label";
import { useUser } from "@/context/UserContext";
import OpeningHours from "./OpeningHours";
import ImagesScroll from "../shared/ImagesScroll";

export default function HistoricalCard(props) {
  const navigate = useNavigate();
  const { prefCurrency } = useUser();
  
  const openHistoricalPage = () => {
    console.log(props.name);
    navigate(`/place/${props.name}`);
  };

  return (
    <div
      className="shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400 hover:cursor-pointer w-[450px] py-4  rounded-xl"
      onClick={openHistoricalPage}
    >
      <img
        className="rounded-lg rounded-b-none h-[300px] w-full object-fill"
        src={props.img}
        alt={props.name}
      />
      <div className="flex place-content-end">
        {props.notTourist && (
          <>
            <Button
              onClick={() => props.deletePlaceFunction(props.placeID)}
              className="w-14 absolute bg-transparent"
            >
              <Trash2 />
            </Button>
            <Button className="w-14 mx-10 absolute bg-transparent">
              <PlaceEditForm
                name={props.name}
                description={props.description}
                pictures={props.pictures}
                location={props.location}
                openingHours={props.openingHours}
                prices={props.prices}
                googleMapLink={props.googlemaps}
                tags={props.tags}
                key={props.key}
                placeID={props.placeID}
                updatePlaceFunction={props.updatePlaceFunction}
              />
            </Button>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <h1 className="flex">
            <span className="font-semibold text-xl mr-auto">{props.name}</span>
            <span className="text-gold drop-shadow">Historical</span>
          </h1>
          <p className="text-base">{props.description}</p>
          <p className="text-base">
            {props.location}{" "}
            <span className="ml-2">
              <Maps mapsSrc={props.googlemaps}></Maps>
            </span>
          </p>
          <p className="text-base">
            <OpeningHours openingHours={props.openingHours} />
          </p>
          <div className="flex flex-col justify-between gap-2">
            <div className="flex justify-between">
              <Label className="font-semibold text-lg text-skyblue">
                Prices:
              </Label>
              <Rating
                rating={props.rating}
                numberOfReviews={props.numberOfReviews}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(props.prices) &&
                props.prices.map((price) => (
                  <span key={price.type} className="text-base">
                    <b>{price.type}:</b> {price.price}{prefCurrency}
                  </span>
                ))}
            </div>
            <div className="flex gap-2">
              {Array.isArray(props.tags) &&
                props.tags.map((tag) => (
                  <Label
                    key={tag._id}
                    className="text-sm text-gray-500 border-gray-500 rounded-full border px-2"
                  >
                    {`#${tag.name_tag}-${tag.option}`}
                  </Label>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <ImagesScroll pictures={props.pictures} />
      </div>
    </div>
  );
}

