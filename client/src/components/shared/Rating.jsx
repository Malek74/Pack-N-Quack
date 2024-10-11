import React from "react";

export const Rating = ({ rating, numberOfReviews = 0, size = "medium" }) => {
  const sizes = {
    small: 12,
    medium: 16,
    large: 24,
  };

  const StarIcon = ({ filled, percentage }) => (
    <svg
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-${sizes[size]} h-${sizes[size]} ${filled ? "" : "text-gray-300"}`}
    >
      <defs>
        <linearGradient id={`grad-${percentage}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${percentage}%`} stopColor="#FFC700" />
          <stop offset={`${percentage}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M9 0L12 6L18 6.75L13.88 11.37L15 18L9 15L3 18L4.13 11.37L0 6.75L6 6L9 0Z"
        fill={filled ? "#FFC700" : `url(#grad-${percentage})`}
        stroke="#FFC700"  // Adding a stroke for the outline
        strokeWidth="1"
      />
    </svg>
  );

  const getStarType = (index) => {
    if (rating >= index) return { filled: true, percentage: 100 };
    if (rating > index - 1 && rating < index) {
      const percentage = (rating - (index - 1)) * 100;
      return { filled: false, percentage };
    }
    return { filled: false, percentage: 0 };
  };

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex gap-1 align-center rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} {...getStarType(star)} />
        ))}
      </div>
      <span className="text-sm text-gray-500">| {numberOfReviews} Reviews</span>
    </div>
  );
};
