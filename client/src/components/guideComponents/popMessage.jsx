import React, { useState } from "react";
import woodPlank from "/assets/images/wood-plank3.png";
import duckie from "/assets/images/bigDuckieWonder.png"; // Add your duckie image here

const GuideMessage = ({guideMessage}) => {
  const [showMessage, setShowMessage] = useState(false);

  // Example message split into lines
  const message = `Need help? 
${guideMessage}`;

  // Split message into individual lines
  const messageLines = message.split("\n");

  return (
    <div>
      <button
        onClick={() => setShowMessage(!showMessage)}
        className="fixed bottom-4 right-3 h-12 w-12 rounded-full bg-yellow-400 text-2xl font-bold text-white shadow-md transition-transform duration-300 hover:scale-110 hover:bg-yellow-500 hover:shadow-lg"
      >
        <logo className= "font-semibold"> ? </logo>
      </button>

      {/* Message Planks */}
      {showMessage && (
        <>
       <div
  style={{
    position: "fixed",
    bottom: "120px",
    right: "325px",
    width: "80px",
    height: "80px",
    cursor: "pointer",
    zIndex: 1,
    display: "flex", // Center the image
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // No background
    border: "none", // Remove border
    boxShadow: "none", // Remove shadow for cleaner look
  }}
>
  <img
    src={duckie}
    alt="Duckie"
    style={{
      width: "80px", // Size the image directly
      height: "80px",
      objectFit: "contain", // Ensure it scales properly without distortion
      borderRadius: "0", // Remove circular styling
    }}
  />
</div>

        <div
          style={{
            position: "fixed",
            bottom: "69px",
            right: "50px", // Adjust position
            // zIndex: 1001,
            // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for the entire component
            // borderRadius: "10px 0 10px 10px", // Slight rounding for overall outline shadow
            overflow: "hidden", // Prevent content overflow
            backgroundColor: "transparent",
          }}
        >
          {messageLines.map((line, index) => (
           <div
  key={index}
  className="mb-[0.09px] h-auto w-80 bg-cover bg-center p-2 px-4 text-center font-serif font-semibold text-white shadow-md"
  style={{
    backgroundImage: `url(${woodPlank})`, // Dynamically set the background image
  }}
>
  {line}
</div>

          ))}
        </div>
        </>
        
      )}
    </div>
  );
};

export default GuideMessage;
