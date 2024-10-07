import React, { useState } from 'react'; 
import { Button } from '@/components/ui/button';

const AddActivity = ({ showModal, setShowModal, onSubmit }) => {
  // State to store form values
  const [activityData, setActivityData] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    dayNumber: ''
  });

  // Handle form value changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setActivityData({ ...activityData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Extract day number from the activity data
    const { dayNumber, ...newActivity } = activityData;

    const activityToAdd = {
      name:newActivity.name,
      description:newActivity.description,
  
      duration:{
          startTime: newActivity.startTime,
          endTime: newActivity.endTime
      },
      location:newActivity.location,
  }


    // Call onSubmit function with day number and new activity data
    if (onSubmit) {
      onSubmit(dayNumber, activityToAdd);
    }

    console.log(newActivity); // Log the new activity data

    // Close the modal after submission
    setShowModal(false);
    
   
    // Reset form data
    setActivityData({
      name: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      dayNumber: ''
    });
  };

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
            
            {/* Form element */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={activityData.name}
                onChange={handleInputChange}
                placeholder="Activity Name"
                className="mb-2 p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                name="description"
                value={activityData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="time"
                name="startTime"
                value={activityData.startTime}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded w-full"
                required
              />
              <input
                type="time"
                name="endTime"
                value={activityData.endTime}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                name="location"
                value={activityData.location}
                onChange={handleInputChange}
                placeholder="Location"
                className="mb-2 p-2 border rounded w-full"
                required
              />
              <input
                type="number"
                name="dayNumber"
                value={activityData.dayNumber}
                onChange={handleInputChange}
                placeholder="Day Number (1, 2, ...)"
                className="mb-2 p-2 border rounded w-full"
                min="1"
                required
              />
              
              {/* Submit button */}
              <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
                Add Activity
              </button>
              
              {/* Cancel button */}
              <button type="button" onClick={() => setShowModal(false)} className="mt-2 bg-gray-500 text-white p-2 rounded w-full">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddActivity;
