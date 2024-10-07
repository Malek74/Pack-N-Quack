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
  const usertype = "tour_guide"; // This value will determine which component to render
  const { toast } = useToast();
  const isTourGuide = usertype === "tour_guide";
  const isAdvertiser = usertype === "advertiser";
  const isSeller = usertype === "seller";
  const isTourist = usertype === "tourist";

  const [profile, setProfile] = useState();
  const endpoint = usertype === "tour_guide" ? "tourGuide" : "advertiser"; // Change API endpoint based on user type
  const userId = "67043893d24088186a943773";

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

  // Advertiser Profile Card (AdvCard)
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
    return null;
  }

  // Tour Guide Profile Card (TourGuideCard)
  function TourGuideCard() {
    if (profile) {
      const {
        previousWork,
        experienceYears,
        email,
        username,
        mobile,
        isAccepted,
      } = profile;

      return (
        <Card className="max-w-md mx-auto shadow-md rounded-lg">
          {/* Tour Guide Info */}
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{username}</CardTitle>
            <Badge
              variant={isAccepted ? "success" : "destructive"}
              className="mt-2"
            >
              {isAccepted ? "Accepted" : "Pending"}
            </Badge>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-4">
            {/* Experience Years */}
            <div>
              <h3 className="text-sm font-semibold">Experience</h3>
              <p className="text-sm text-muted-foreground">
                {experienceYears} years of experience
              </p>
            </div>

            {/* Previous Work Section */}
            <div>
              <h3 className="text-sm font-semibold">Previous Work</h3>
              <div className="space-y-2">
                {Array.isArray(previousWork) && previousWork.length > 0 ? (
                  previousWork.map((work, index) => (
                    <div key={index} className="border p-2 rounded-lg">
                      <p className="font-semibold text-sm">{work.title}</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Company:</strong> {work.company}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Duration:</strong>{" "}
                        {work.duration.length > 0
                          ? `${new Date(
                              work.duration[0]
                            ).toLocaleDateString()} - ${new Date(
                              work.duration[1]
                            ).toLocaleDateString()}`
                          : "Duration not available"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {work.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No previous work data available.
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold">Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> {email}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Mobile:</strong> {mobile}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <CreateDialog
                form={
                  <TourGuideProfile
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
    return null;
  }

  return (
    <div>
      <MyFirstComponent />
      {isTourGuide && <div>{profile && <TourGuideCard />}</div>}
      {isAdvertiser && <div>{profile && <AdvCard />}</div>}
      {isSeller && <SellerProfile />}
      {isTourist && <TouristProfile />}
    </div>
  );
}
