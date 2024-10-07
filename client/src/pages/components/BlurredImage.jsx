import React from 'react';
import Image from '../../assets/landscape.jpg'; // Adjust the path accordingly

const BlurredImage = ({price}) => {
  return (
    <div className="relative w-[580px] h-full rounded-2xl overflow-hidden"> {/* Fixed size for the container */}
      <img
        src={Image}
        alt="Blurred"
        className="object-cover w-full h-full"
        style={{ filter: 'blur(5px)', borderRadius: 'inherit' }} // Blur the image and keep the border radius
      />
      <div className="absolute top-4 right-4 p-2 bg-white rounded-2xl shadow-md"> {/* White rounded background */}
        <h1 className="text-black text-xl font-bold">{`$${price}`}</h1> {/* Text inside the rounded background */}
      </div>
    </div>
  );
};

export default BlurredImage;
