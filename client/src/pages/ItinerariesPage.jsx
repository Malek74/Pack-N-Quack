import React, { useState } from 'react';
import ItineraryCard from './components/ItineraryCard';
import Banner from './components/BannerV2';
import BannerImage from '../assets/romanBanner.jpg';

const ItinerariesPage = () => {
  const [itineraries, setItineraries] = useState([
    {
      title: "Discover France",
      description:
        "Explore the rich culture of France with this itinerary! Begin in Paris, the City of Lights, where you'll visit iconic landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral. Then, venture into the wine country of Bordeaux and the rolling lavender fields of Provence. Finally, unwind on the glamorous beaches of the French Riviera. This journey combines history, art, cuisine, and natural beauty to give you an unforgettable French experience.",
      price: "1200",
      point1: "Landmarks",
      point2: "Cuisine",
      point3: "Beaches",
      language: "English"
      // direction: "flex-row"
    },
    {
      title: "Grand Tour of Italy",
      description:
        "Discover the timeless beauty of Italy with this extensive itinerary! Start in Rome, where ancient ruins like the Colosseum and Roman Forum await. Marvel at Vatican City, home to St. Peter's Basilica and the Sistine Chapel. Travel to Florence for Renaissance art and architecture, and then to Venice, where gondola rides through scenic canals offer a glimpse of its unique charm. Conclude your trip in the Amalfi Coast, renowned for its stunning cliffs and azure waters.",
      price: "1500",
      point1: "Ancient Ruins",
      point2: "Art & Architecture",
      point3: "Coastal Views",
      language: "English"
      // direction: "flex-row-reverse"
    },
    {
      title: "Mystical Japan",
      description:
        "Embark on a journey through the ancient and modern wonders of Japan. Begin in Tokyo, a city where cutting-edge technology meets traditional temples. Visit Kyoto, where you can stroll through tranquil bamboo forests, serene Zen gardens, and centuries-old shrines. Experience the beauty of Mount Fuji and enjoy a hot spring bath in the nearby Hakone region. Finally, head to Hiroshima to witness a city that has transformed into a symbol of peace and resilience.",
      price: "1800",
      point1: "Modern Cities",
      point2: "Historic Temples",
      point3: "Natural Wonders",
      language: "English"
      // direction: "flex-row"
    },
    {
      title: "Scenic New Zealand",
      description:
        "Experience the stunning landscapes of New Zealand with this outdoor adventure itinerary. Start in Auckland and make your way to Rotorua, known for its geothermal activity and Maori culture. Then, explore the rolling hills of Hobbiton and continue to Queenstown, the adventure capital, where activities like bungee jumping, skiing, and mountain biking await. Finally, visit the majestic Milford Sound, a fjord surrounded by towering cliffs and cascading waterfalls.",
      price: "2000",
      point1: "Outdoor Adventures",
      point2: "Cultural Experiences",
      point3: "Fjord Exploration",
      language: "Arabic"
      // direction: "flex-row-reverse"
    },
    {
      title: "Treasures of Egypt",
      description:
        "Delve into the wonders of ancient Egypt with this historically rich itinerary. Begin your journey in Cairo, where the Great Pyramids of Giza and the Sphinx stand as testaments to Egypt's grandeur. Sail along the Nile River to Luxor, home to the Valley of the Kings and Karnak Temple. Explore the temples of Abu Simbel, and cap off your trip with a visit to the vibrant markets of Aswan. This itinerary is perfect for history buffs and those seeking a connection to one of the world's oldest civilizations.",
      price: "1700",
      point1: "Ancient Monuments",
      point2: "Nile River Cruise",
      point3: "Cultural Immersion",
      language: "Arabic"
      
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    point1: '',
    point2: '',
    point3: '',
    language:'',
  });

  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Flag to check if updating or adding
  const [currentIndex, setCurrentIndex] = useState(null); // To keep track of which itinerary is being updated

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addItinerary = () => {
    setItineraries([...itineraries, formData]);
    resetForm();
  };

  const updateItinerary = () => {
    const updatedItineraries = itineraries.map((itinerary, index) =>
      index === currentIndex ? formData : itinerary
    );
    setItineraries(updatedItineraries);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', point1: '', point2: '', point3: '', language:'', direction: 'flex-row' });
    setShowModal(false);
    setIsUpdating(false);
    setCurrentIndex(null);
  };

  const removeItinerary = (index) => {
    const updatedItineraries = itineraries.filter((_, i) => i !== index);
    setItineraries(updatedItineraries);
  };

  // Function to handle the update button click
  const openUpdateModal = (index) => {
    setFormData(itineraries[index]); // Pre-fill the form with the itinerary data
    setCurrentIndex(index); // Set the current index of the itinerary being updated
    setIsUpdating(true); // Set the flag to updating
    setShowModal(true); // Show the modal
  };

  return (
    <div className='flex flex-col gap-y-10 ml-11 p-8'>
      <Banner background={BannerImage} name="Itineraries" />
      <div className='w-full pe-14 flex justify-center'>
      <button onClick={() => setShowModal(true)} className="my-4 bg-gray-300 text-white p-2 rounded w-full hover:bg-gray-400">
        Add Itinerary
      </button>
      </div>

     

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="font-bold mb-2">{isUpdating ? 'Update Itinerary' : 'Add New Itinerary'}</h3>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              placeholder="Title" 
              className="mb-2 p-2 border rounded w-full"
            />
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Description" 
              className="mb-2 p-2 border rounded w-full"
            />
            <input 
              type="text" 
              name="price" 
              value={formData.price} 
              onChange={handleInputChange} 
              placeholder="Price" 
              className="mb-2 p-2 border rounded w-full"
            />
            <input 
              type="text" 
              name="point1" 
              value={formData.point1} 
              onChange={handleInputChange} 
              placeholder="Point 1" 
              className="mb-2 p-2 border rounded w-full"
            />
            <input 
              type="text" 
              name="point2" 
              value={formData.point2} 
              onChange={handleInputChange} 
              placeholder="Point 2" 
              className="mb-2 p-2 border rounded w-full"
            />
            <input 
              type="text" 
              name="point3" 
              value={formData.point3} 
              onChange={handleInputChange} 
              placeholder="Point 3" 
              className="mb-2 p-2 border rounded w-full"
            />
            <input 
              type="text" 
              name="language" 
              value={formData.language} 
              onChange={handleInputChange} 
              placeholder="Language" 
              className="mb-2 p-2 border rounded w-full"
            />
            <button 
              onClick={isUpdating ? updateItinerary : addItinerary} 
              className="bg-green-500 text-white p-2 rounded"
            >
              {isUpdating ? 'Update Itinerary' : 'Add Itinerary'}
            </button>
            <button 
              onClick={resetForm} 
              className="ml-2 bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {itineraries.map((itinerary, index) => (
        <ItineraryCard 
          key={index}
          direction={index % 2 === 0 ? "flex-row" : "flex-row-reverse"}
          title={itinerary.title}
          description={itinerary.description}
          price={itinerary.price}
          point1={itinerary.point1}
          point2={itinerary.point2}
          point3={itinerary.point3}
          language={itinerary.language}
          onDelete={() => removeItinerary(index)} // Pass the delete function
          onUpdate={() => openUpdateModal(index)} // Pass the update function
        />
      ))}
       
    </div>
  );
};

export default ItinerariesPage;
