
import MyFirstComponent from "@/components/MyFirstComponent";
import TouristProfile from "@/components/forms/TouristProfile";
import TourGuideProfile from "@/components/forms/TourGuideProfile";
import AdvertiserProfile from "@/components/forms/AdvertiserProfile";
import SellerProfile from "@/components/forms/SellerProfile";

export default function MyProfilePage() {
  const usertype = "tourist"; // This value will determine which component to render

  const isTourGuide = usertype === "tour_guide";
  const isAdvertiser = usertype === "advertiser";
  const isSeller = usertype === "seller";
  const isTourist = usertype === "tourist";

  return (
    <div>
        <MyFirstComponent/>
      {isTourGuide && <TourGuideProfile />}
      {isAdvertiser && <AdvertiserProfile />}
      {isSeller && <SellerProfile />}
      {isTourist && <TouristProfile />}
    </div>
  );
}
