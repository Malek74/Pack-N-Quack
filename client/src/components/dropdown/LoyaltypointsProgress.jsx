"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Infinity } from "lucide-react";

export default function LoyaltyPointsProgress({ currentPoints = 0 }) {
  const maxPoints = {
    bronze: 100000,
    silver: 500000,
    gold: Infinity,
  };

  const getMaxPointsForLevel = (points) => {
    if (points > maxPoints.silver) return maxPoints.gold;
    if (points > maxPoints.bronze) return maxPoints.silver;
    return maxPoints.bronze;
  };

  const [progress, setProgress] = React.useState(0);
  const maxPointsForLevel = getMaxPointsForLevel(currentPoints);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Cap progress at 100% if currentPoints exceeds silver max
      const calculatedProgress = currentPoints >= maxPoints.silver ? 100 : (currentPoints / maxPointsForLevel) * 100;
      setProgress(calculatedProgress);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentPoints, maxPointsForLevel]);

  return (
    <div className="space-y-2 px-6 w-full">
      <div
        className="h-4 rounded-md overflow-hidden"
        style={{ backgroundColor: "#F9F9F9" }} // Set off-white background
      >
        <div
          className="h-full"
          style={{
            width: `${progress}%`,
            backgroundColor: "#FFD700", // Set "ducky yellow" color
            transition: "width 0.5s ease",
          }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>0</span>
        <span>{maxPointsForLevel === Infinity ? <Infinity className="inline h-4 w-4" /> : maxPointsForLevel}</span>
      </div>
      <div className="text-center font-medium">
        {currentPoints} / {maxPointsForLevel === Infinity ? "∞" : maxPointsForLevel} points
      </div>
      <div className="text-center">
        {currentPoints > maxPoints.silver ? "Level: Gold" : currentPoints > maxPoints.bronze ? "Level: Silver" : "Level: Bronze"}
      </div>
    </div>
  );
}
