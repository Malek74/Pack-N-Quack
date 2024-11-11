// src/pages/NotFoundPage.jsx
import React from "react";
import notFoundImage from "../../../public/assets/images/notFound.png";
const NotFoundPage = () => {
  return (
    <div className="text-center text-red-600 flex flex-col items-center justify-center py-8">
      <h1 className="text-2xl mb-4">Page not found</h1>
      <img src={notFoundImage} alt="Sofa 1" className="w-[300px] h-[300px]" />
    </div>
  );
};

export default NotFoundPage;
