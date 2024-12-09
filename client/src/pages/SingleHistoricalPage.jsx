import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { ShareButton } from "@/components/shared/ShareButton";
import { Clock, MapPin, Ticket, Info, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import ImagesScroll from "@/components/shared/ImagesScroll";
import Maps from "@/components/shared/Maps";
import OpeningHours from "@/components/historicalPage/OpeningHours";

export default function SingleHistoricalPage() {
  const { name } = useParams();
  const [historicalPlace, setHistoricalPlace] = useState(null);
  const { prefCurrency } = useUser();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const fetchHistoricalPlace = async () => {
    try {
      const response = await axios.get(
        `/api/places/${name}?currency=${prefCurrency}`
      );
      setHistoricalPlace(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistoricalPlace();
  }, [name, prefCurrency]);

  if (!historicalPlace) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const {
    description,
    pictures,
    location,
    googlemaps,
    openingHours,
    prices,
    tags,
  } = historicalPlace;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <ImagesScroll pictures={pictures} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-2">{name}</h1>
          <div className="flex items-center text-gray-200 text-lg md:text-xl">
            <MapPin className="mr-2 h-5 w-5" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <motion.button
            className="flex items-center text-gray-700 font-semibold"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "Hide" : "Show"} full description
            <ChevronDown className={`ml-1 transform transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
          </motion.button>
          <ShareButton title={name} link={window.location.href} />
        </div>

        <AnimatePresence>
          {showFullDescription && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 text-gray-700 leading-relaxed"
            >
              {description}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
              <Clock className="mr-2 h-6 w-6 text-gray-600" />
              Opening Hours
            </h2>
            <OpeningHours openingHours={openingHours} />
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
              <Ticket className="mr-2 h-6 w-6 text-gray-600" />
              Admission Prices
            </h2>
            <div className="space-y-3">
            {Array.isArray(prices) &&
                prices.map((price) => (
                  <span key={price.type} className="text-base">
                    <b>{price.type}:</b> {price.price}{prefCurrency}
                  </span>
                ))}
            </div>
          </motion.div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
            <Info className="mr-2 h-6 w-6 text-gray-600" />
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(tags) &&
              tags.map((tag) => (
                <span
                  key={tag._id}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag.name_tag}-{tag.option}
                </span>
              ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Location</h2>
          <div className="rounded-xl overflow-hidden shadow-md">
            <Maps mapsSrc={googlemaps} />
          </div>
        </div>
      </div>
    </div>
  );
}

