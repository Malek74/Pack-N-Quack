import MyFirstComponent from "@/components/MyFirstComponent";
import TouristProfile from "@/components/forms/TouristProfile";
import TourGuideProfile from "@/components/forms/TourGuideProfile";
import AdvertiserProfile from "@/components/forms/AdvertiserProfile";
import SellerProfile from "@/components/forms/SellerProfile";
import CreateDialog from "@/components/CreateDialog";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
export default function MyProfilePage() {
  const usertype = "advertiser"; // This value will determine which component to render
  const { toast } = useToast();
  const isTourGuide = usertype === "tour_guide";
  const isAdvertiser = usertype === "advertiser";
  const isSeller = usertype === "seller";
  const isTourist = usertype === "tourist";

  const [profile, setProfile] = useState();
  const endpoint = "advertisers";
  const userId = "670422fdde2123588af70756";

  const fetchProfile = () => {
    axios
      .get(`api/${endpoint}/${userId}`)
      .then((response) => {
        setProfile(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchProfile(); // Initial fetch when component mounts
  }, []);

  function AdvCard() {
    if (profile) {
      const {
        companyName,
        description,
        establishmentDate,
        hotline,
        website,
        email,
        username,
        isAccepted,
      } = profile;
      return (
        <Card className="max-w-md mx-auto shadow-md rounded-lg">
          {/* Company Name */}
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {companyName}
            </CardTitle>
            <Badge
              variant={isAccepted ? "success" : "destructive"}
              className="mt-2"
            >
              {isAccepted ? "Accepted" : "Pending"}
            </Badge>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-4">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Establishment Date */}
            <div>
              <h3 className="text-sm font-semibold">Established</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(establishmentDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold">Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Hotline:</strong> {hotline}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Website:</strong>{" "}
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {website.replace("https://", "").replace("www.", "")}
                </a>
              </p>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-sm font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>

            {/* Username */}
            <div>
              <h3 className="text-sm font-semibold">Username</h3>
              <p className="text-sm text-muted-foreground">{username}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <CreateDialog
                form={
                  <AdvertiserProfile
                    profile={profile}
                    onRefresh={fetchProfile}
                  />
                }
              />
            </div>
          </CardContent>
        </Card>
      );
    }
  }
  return (
    <div>
      <MyFirstComponent />
      {isTourGuide && <TourGuideProfile />}
      {isAdvertiser && <div>{profile && <AdvCard />}</div>}
      {isSeller && <SellerProfile />}
      {isTourist && <TouristProfile />}
    </div>
  );
}
