// src/pages/NotFoundPage.jsx
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="text-center text-red-600 flex flex-col items-center justify-center py-8">
      <h1 className="text-2xl mb-4">Page not found</h1>
      <img
        src="/src/assets/notfound.webp"
        alt="Sofa 1"
        className="w-[300px] h-[300px]"
      />
    </div>
  );
};

export default NotFoundPage;
