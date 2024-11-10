import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MyProfilePage from "@/pages/MyProfilePage";
import ImagesScroll from "../shared/ImagesScroll";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import BannerImage from "/assets/images/homeBanner.png";
import Banner from "../shared/BannerV2";
import LoyaltyPointsProgress from "./LoyaltypointsProgress";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useUser } from "@/context/UserContext";
export default function PointsAndLoyalty({ profileData }) {
  const {toast} = useToast();
  const {prefCurrency} = useUser();
  console.log(profileData);
  const [walletBalance, setWalletBalance] = useState();
  const [loyaltyPoints, setLoyaltyPoints] = useState();
  const [badge, setBadge] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const usertype = "tourist"; // This value will determine which component to render
  const [profile, setProfile] = useState();
  const endpoint = "tourist";
  const userId = "6702e01d2ed9e2a0d138f58b";

  const fetchProfile = () => {
    axios
      .get(`api/${endpoint}/${userId}`)
      .then((response) => {
        setProfile(response.data);
        console.log(response.data);
        setLoyaltyPoints(response.data.loyaltyPoints);
        setWalletBalance(response.data.wallet);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchProfile(); // Initial fetch when component mounts
  }, [prefCurrency]);



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
  
  const currentMaxPoints = getMaxPointsForLevel(loyaltyPoints);
  
  // Update badge based on points thresholds
  useEffect(() => {
    if (loyaltyPoints > 500000) setBadge("Gold");
    else if (loyaltyPoints > 100000) setBadge("Silver");
    else setBadge("Bronze");
  }, [loyaltyPoints]);

 
  // Calculate points based on amount paid and level
  const addLoyaltyPoints = (amountPaid) => {
    let pointsToAdd;
    if (loyaltyPoints > 500000) pointsToAdd = amountPaid * 1.5;
    else if (loyaltyPoints > 100000) pointsToAdd = amountPaid * 1;
    else pointsToAdd = amountPaid * 0.5;

    setLoyaltyPoints(loyaltyPoints + pointsToAdd);
  };

  const renderPoints = () => {
    return (
      <div className="mt-4">
        <Input
          type="number"
          value={pointsToRedeem}
          placeholder="Enter points to redeem"
          onChange={(e) => setPointsToRedeem(e.target.value)}
          className="w-full mb-2"
        />
        <Button
          onClick={redeemPoints}
          className="w-full bg-gold text-white font-semibold"
        >
          Redeem Points
        </Button>
      </div>
    );
  };
  // Redeem points to wallet balance
  const redeemPoints = () => {
    const pointsToRedeemNum = parseInt(pointsToRedeem, 10);
    if (pointsToRedeemNum <= 0) {
      toast({
        description: "Please enter a valid number of points to redeem.",
        variant: "destructive"
      })
      return;
    }
    const redeemableValue = (pointsToRedeemNum / 10000) * 100; // 10,000 points = 100 EGP
    if (pointsToRedeemNum <= loyaltyPoints) {
      setWalletBalance(walletBalance + redeemableValue);
      setLoyaltyPoints(loyaltyPoints - pointsToRedeemNum);
      setPointsToRedeem("");
      toast({
        description: `Redeemed ${pointsToRedeem} points for ${prefCurrency} ${redeemableValue} !`,
        variant: "success"
      })
    } else {
        toast({
          description: "Invalid points to redeem.",
          variant: "destructive"
        })
    }
  };
  
  

  return (
    <div className="px-16 pb-12">
      <Banner
        background={BannerImage}
        alt="Hustling market"
        name="Points and Loyalty."
        textAlign="left"
        description=" Save money on your next adventure with Pack'N Quack." />
      <div className="px-80 bg-blend-color">
        {/* Card for Wallet Balance, Loyalty Points, and Badge */}
       

        <div className="py-8 border flex flex-col gap-8 justify-center items-center border-gray-200 rounded-2xl shadow-md my-4 bg-white">
          <div className="flex flex-row justify-around gap-14 items-center">
            <div className="flex-1 flex items-center justify-center text-left">
              <img
                src="/assets/images/wallet.png"
                alt="Wallet"
                className="h-24 w-auto mr-3"
              />
              <div className="flex flex-col">
                {/* Stack text vertically */}
                <h2 className="text-2xl font-semibold">Wallet Balance</h2>
                <p className="text-gray-700 text-lg">
                  {prefCurrency} {walletBalance} 
                </p>
              </div>
            </div>

            {/* Loyalty Points and Badge */}
            <div className="flex-1 flex items-center justify-center text-left">
              <img
                src={
                  badge === "Gold"
                    ? "/assets/images/gold.png"
                    : badge === "Silver"
                    ? "/assets/images/silver.png"
                    : "/assets/images/bronze.png"
                }
                alt={badge}
                className="w-auto h-28"
              />
              <div className="flex flex-col ml-4">
                {" "}
                {/* Stack text vertically */}
                <h2 className="text-2xl font-semibold">Loyalty Points</h2>
                <p className="text-gray-700 text-lg mr-4">
                  {loyaltyPoints} Points
                </p>
              </div>
            </div>
           </div>
           <LoyaltyPointsProgress currentPoints={loyaltyPoints} maxPoints={currentMaxPoints} />
          </div>
       

        {renderPoints()}
      </div>
    </div>
  );
}
