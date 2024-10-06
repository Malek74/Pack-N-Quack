import React from 'react';
import { Button } from '@/components/ui/button';

const AddActivity = ({ showModal, setShowModal }) => {
  return (
    <>
      {/* Button to trigger the modal popup for adding a new activity */}
      <Button onClick={() => setShowModal(true)} className="bg-yellow-500 p-2 hover:bg-yellow-400">
        Add New Activity
      </Button>

      {/* Add Activity Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="font-bold mb-2">Add New Activity</h3>
            <input
              type="text"
              placeholder="Activity Name"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Description"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="time"
              placeholder="Start Time"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="time"
              placeholder="End Time"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Location"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="number"
              placeholder="Day Number (1, 2, ...)"
              className="mb-2 p-2 border rounded w-full"
              min="1"
            />
            <button className="bg-green-500 text-white p-2 rounded w-full" onClick={() => setShowModal(false)}>Add Activity</button>
            <button onClick={() => setShowModal(false)} className="mt-2 bg-gray-500 text-white p-2 rounded w-full">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddActivity;
