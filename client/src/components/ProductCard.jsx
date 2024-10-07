import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { EditProductDialog } from "./EditProduct";
import { Rating } from "./Rating";

export default function ProductCard(props) {
  return (
    <div className="rounded-xl w-[20rem] h-[25rem] shadow-md relative overflow-hidden">
      {/* Image Section */}
      <img
        className="w-full h-[11rem] object-cover rounded-t-lg"
        src={props.img}
        alt={props.alt}
      />

      {/* Button Section */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button className="">
          <Trash2 />
        </Button>
        <EditProductDialog
          className="w-14 absolute bg-transparent"
          product={{
            name: props.name,
            price: props.price,
            description: props.description,
            available_quantity: props.quantity,
          }}
        ></EditProductDialog>
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col gap-2 p-5">
        <div>
          {/* Product Name Section with fixed height */}
          <h1 className="flex">
            <span className="font-semibold text-xl mr-auto mb-0 h-14 overflow-hidden line-clamp-2">
              {props.name}
            </span>
          </h1>
          <h2 className="text-gray-500">{props.seller}</h2>
        </div>
        <Rating
          rating={props.rating}
          size="medium"
          numberOfReviews={props.reviewsCount}
        />
        <h4 className="text-base line-clamp-2">{props.description}</h4>
        <h4 className="flex">
          <span className="text-xl text-[#71BCD6] drop-shadow mr-auto">
            {props.price} EGP
          </span>
        </h4>
      </div>
    </div>
  );
}
