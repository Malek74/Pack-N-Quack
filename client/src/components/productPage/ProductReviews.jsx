import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Rating } from "../shared/Rating";
export default function ProductReviews({ item }) {
  const [activeTab, setActiveTab] = useState("description");

  function parseTimestamp(isoString) {
    const padZero = (num) => (num < 10 ? `0${num}` : num);

    const date = new Date(isoString);

    const day = padZero(date.getUTCDate());
    const month = padZero(date.getUTCMonth() + 1);
    const year = date.getUTCFullYear();

    const hours = date.getUTCHours();
    const minutes = padZero(date.getUTCMinutes());

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = padZero(hours % 12 || 12);

    return `${month}-${day}-${year}, ${formattedHours}:${minutes} ${period}`;
  }
  const ratingsExist = item.reviews.data.length === 0 ? false : true;

  const tailwindColors = [
    "bg-bage font-semibold",
    "bg-Pantone text-white font-semibold",
  ];

  function getRandomTailwindColor() {
    const randomIndex = Math.floor(Math.random() * tailwindColors.length);
    return tailwindColors[randomIndex];
  }

  function Ratings() {
    return item.reviews.data.map((review) => {
      const colorClass = getRandomTailwindColor();
      return (
        <li key={review.id} className="flex flex-1">
          <Card className="flex flex-col min-h-full w-full">
            <CardHeader className="flex flex-row gap-4 pt-8 pb-4 items-center">
              <Avatar>
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback className={`${colorClass}`}>CN</AvatarFallback>
              </Avatar>

              <Rating rating={review.attributes.rating} />
            </CardHeader>

            <CardContent>
              <p className="font-semibold">{review.attributes.content}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <p>{parseTimestamp(review.attributes.createdAt)}</p>
            </CardFooter>
          </Card>
        </li>
      );
    });
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-center space-x-8 mb-6">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-2 text-xl font-medium leading-9  ${
            activeTab === "description"
              ? "border-b-2 border-gray-800"
              : "text-litegray"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 text-xl font-medium leading-9 ${
            activeTab === "reviews"
              ? "border-b-2 border-gray-800"
              : "text-litegray"
          }`}
        >
          Reviews [{item.reviews.data.length}]
        </button>
      </div>

      {activeTab === "description" && (
        <div>
          <div className="text-center px-4 lg:px-44">
            <p className="text-litegray mb-8 text-base font-normal leading-6 text-justify">
              {item.long_desc}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 justify-center justify-items-center px-8">
            <div className="bg-almond flex align-center justify-center rounded-lg shadow-lg">
              <img src="/src/assets/images/sofa1.webp" alt="Sofa 1" />
            </div>
            <div className="bg-almond flex align-center justify-center rounded-lg shadow-lg">
              <img src="/src/assets/images/sofa2.webp" alt="Sofa 2" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="lg:px-32">
          {ratingsExist && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 justify-center items-stretch lg:px-8">
              <Ratings />
            </ul>
          )}
          {!ratingsExist && (
            <div className="flex text-center justify-center">
              No reviews posted yet!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
