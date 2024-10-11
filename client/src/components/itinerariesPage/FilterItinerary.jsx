import React, { useState } from 'react';

const FilterItinerary = ({ onFilter }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [language, setLanguage] = useState('');

  const handleFilter = () => {
    onFilter(minPrice, maxPrice, language); // Pass the filter values to the parent
    setShowFilterModal(false); // Close the filter modal
  };

  return (
    <div className="mb-4">
      <button 
        onClick={() => setShowFilterModal(true)} 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      >
        Filter Itineraries
      </button>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="font-bold mb-2">Filter Itineraries</h3>
            <input
              type="text"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Language"
              className="mb-2 p-2 border rounded w-full"
            />
            <button
              onClick={handleFilter}
              className="bg-green-500 text-white p-2 rounded"
            >
              Apply Filter
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="ml-2 bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterItinerary;
