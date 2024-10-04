import React from "react";
import CustomMap from "./CustomMap";
import { APIProvider } from "@vis.gl/react-google-maps";


const MapsApp = () => {
  return (
    <div className="flex p-20 justify-evenly">
      <APIProvider apiKey="AIzaSyBI9u9dhoQehm_TCYPf2acTBCZhI42dA2M">
        <CustomMap />
      </APIProvider>
    </div>
  );
};

export default MapsApp;