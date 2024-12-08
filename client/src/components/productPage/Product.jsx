import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Rating } from "./Rating";
import { Counter } from "../ui/counter";
import { SizeTags } from "./SizeTags";
import { ColorTags } from "./ColorTags";
import MyGallery from "./MyGallery";
import facebook from "@/assets/icons/facebook.svg";
import twitter from "@/assets/icons/twitter.svg";
import linkedin from "@/assets/icons/linkedin.svg";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ItemsContext } from "@/components/context/CartContext";

export default function Product({ item }) {
  //get the id from the params dou id is not passed in the item props
  const { id } = useParams();
  const { toast } = useToast();
  console.log(typeof id);

  const { items, setItems, addItem } = useContext(ItemsContext);

  function calculateAverageRating(data) {
    const ratings = data.map((item) => item.attributes.rating);
    let sum = 0;
    ratings.forEach((num) => (sum += num));
    const averageRating = sum / ratings.length;
    return averageRating;
  }

  const [itemQuantity, setItemQuantity] = useState(1);

  const itemObject = {
    id: parseInt(id),
    img: item.image.data.attributes.url,
    product: item.name,
    price: item.price,
    itemCount: item.count,
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
      <MyGallery
        image={item.image.data.attributes}
        sliders={item.slider.data.map((item) => {
          const thumbnailExists =
            item.attributes.formats && item.attributes.formats.thumbnail;
          return {
            photo: item.attributes.url,
            alternativeText: item.attributes.alternativeText,
            id: item.id,
            ...(thumbnailExists && {
              thumbnail: item.attributes.formats.thumbnail.url,
            }),
          };
        })}
      />

      <section className="mt-4 flex w-full flex-col space-y-2 lg:mt-0">
        <h1 className="text-[2rem] font-normal lg:text-[2.25rem] xl:text-[2.625rem]">
          {item.name}
        </h1>
        <h3 className="text-litegray font-poppins text-[1.5rem] font-medium">
          Rs. {item.price.toLocaleString()}.00
        </h3>
        <div className="flex items-center">
          {item.reviews.data.length > 0 && (
            <Rating rating={calculateAverageRating(item.reviews.data)} />
          )}
          <span className="text-litegray flex items-center text-[0.8rem] font-normal">
            {item.reviews.data.length > 0 && (
              <span className="mx-2 h-6 border-l border-gray-400"></span>
            )}
            {item.reviews.data.length} Customer Reviews
          </span>
        </div>
        <p className="font-poppins xl:8/12 text-[0.8rem] font-normal leading-[20px] lg:w-9/12 lg:text-[1rem] lg:leading-[25px]">
          {item.short_desc}
        </p>

        <section className="space-y-4 pb-8 pt-2">
          <div className="align-center flex justify-between gap-4 lg:flex-col">
            <SizeTags size={item.size} />
            <ColorTags color={item.color} />
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:gap-2 xl:pe-12">
            <Counter
              maxItems={item.count}
              value={itemQuantity}
              onChange={setItemQuantity}
            />
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-[15px] border-black p-2 text-[1.25rem] lg:p-6"
              disabled={item.count === 0}
              onClick={() => addToCartHandler(itemObject)}
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
          {item.count === 0 && (
            <h3 className="text-Pantone">Currently out of stock!</h3>
          )}
        </section>

        <hr className="py-4" />
        <section className="text-litegray space-y-2 text-base font-normal leading-6">
          <dl>
            <div className="flex">
              <dt className="lg:w-16">SKU</dt>
              <dd className="flex items-center">
                <span className="mx-2 lg:mx-4">:</span>
                <span>{item.sku}</span>
              </dd>
            </div>

            <div className="flex">
              <dt className="lg:w-16">Category</dt>
              <dd className="flex items-center">
                <span className="mx-2 lg:mx-4">:</span>
                <span>{item.category.data.attributes.name}</span>
              </dd>
            </div>

            <div className="flex">
              <dt className="lg:w-16">Tags</dt>
              <dd className="flex items-center">
                <span className="mx-2 lg:mx-4">:</span>
                <span>
                  {item.tags.data
                    .map((item) => item.attributes.name)
                    .join(", ")}
                </span>
              </dd>
            </div>
          </dl>

          <article className="text-litegray flex items-center text-base font-normal leading-6">
            <span className="lg:w-16">Share</span>
            <span className="mx-1 lg:mx-4">:</span>
            <div className="justify-top flex space-x-2 lg:space-x-4">
              <a href="https://www.facebook.com/">
                <img src={facebook} alt="Facebook" />
              </a>
              <a href="https://www.linkedin.com/">
                <img src={linkedin} alt="LinkedIn" />
              </a>
              <a href="https://www.twitter.com/">
                <img src={twitter} alt="Twitter" />
              </a>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
