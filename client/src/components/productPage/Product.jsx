import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Rating } from "../shared/Rating";
import Counter from "../shared/QuantityInput";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

export default function Product({ item }) {
  const { toast } = useToast();
  const { addItem } = useCart();
  const { prefCurrency } = useUser();
  // Helper to calculate the average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const [itemQuantity, setItemQuantity] = useState(1);

  const itemObject = {
    id: item._id,
    img: item.picture,
    product: item.name,
    price: item.price,
    itemCount: item.available_quantity,
    quantity: itemQuantity,
  };

  useEffect(() => {
    itemObject.quantity = itemQuantity;
  }, [itemQuantity]);

  const addToCartHandler = () => {
    addItem(itemObject, itemQuantity, toast);
  };

  return (
    <main className="font-poppins flex flex-col gap-2 px-4 py-8 lg:flex-row lg:items-start lg:space-x-4 lg:px-14 xl:gap-20 xl:px-20">
      {/* Product Image */}
      <section>
        <img
          src={item.picture}
          alt={item.name}
          className="rounded-lg border border-gray-200"
        />
      </section>

      {/* Product Details */}
      <section className="mt-4 flex w-full flex-col space-y-2 lg:mt-0">
        <h1 className="text-[2rem] font-normal lg:text-[2.25rem] xl:text-[2.625rem]">
          {item.name}
        </h1>
        <h3 className="text-litegray font-poppins text-[1.5rem] font-medium">
          {prefCurrency}
          {item.price.toLocaleString()}
        </h3>
        <div className="flex items-center">
          {item.ratings.reviews.length > 0 && (
            <Rating rating={calculateAverageRating(item.ratings.reviews)} />
          )}
          <span className="text-litegray flex items-center text-[0.8rem] font-normal">
            {item.ratings.reviews.length > 0 && (
              <span className="mx-2 h-6 border-l border-gray-400"></span>
            )}
            {item.ratings.reviews.length} Customer Reviews
          </span>
        </div>
        <p className="font-poppins xl:8/12 text-[0.8rem] font-normal leading-[20px] lg:w-9/12 lg:text-[1rem] lg:leading-[25px]">
          {item.description}
        </p>

        {/* Action Buttons */}
        <section className="space-y-4 pb-8 pt-2">
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-2 xl:pe-12">
            <Counter
              maxItems={item.available_quantity}
              value={itemQuantity}
              onChange={setItemQuantity}
            />
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-[15px] border-black p-2 text-[1.25rem] lg:p-6"
              disabled={item.available_quantity === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-[15px] border-black p-2 text-[1.25rem] lg:p-6"
            >
              + Compare
            </Button>
          </div>
          {item.available_quantity === 0 && (
            <h3 className="text-Pantone">Currently out of stock!</h3>
          )}
        </section>

        <hr className="py-4" />

        {/* Additional Information */}
        <section className="text-litegray space-y-2 text-base font-normal leading-6">
          <dl>
            <div className="flex">
              <dt className="lg:w-16">Seller</dt>
              <dd className="flex items-center">
                <span className="mx-2 lg:mx-4">:</span>
                <span>{item.sellerUsername}</span>
              </dd>
            </div>
          </dl>
        </section>
      </section>
    </main>
  );
}
