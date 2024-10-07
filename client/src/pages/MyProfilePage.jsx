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
import SellerProfileDialog from "@/components/forms/SellerProfileDialog";
export default function MyProfilePage() {
  const usertype = "tourist"; // This value will determine which component to render
  const { toast } = useToast();

  const isTourGuide = usertype === "tour_guide";
  const isAdvertiser = usertype === "advertiser";
  const isSeller = usertype === "seller";
  const isTourist = usertype === "tourist";
  console.log(isTourist);
  const [profile, setProfile] = useState();
  const endpoint = "tourist";
  const userId = "6702e1342ed9e2a0d138f599";

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

  function SellerCard() {
    if (profile) {
      const { email, username, isAccepted, description } = profile;
      return (
        <Card className="max-w-md mx-auto shadow-md rounded-lg">
          {/* Company Name */}
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
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
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
                  <SellerProfileDialog
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

  function TouristCard() {
    if (profile) {
      const {
        name,
        mobile,
        dob,
        email,
        nationality,
        role,
        jobTitle,
        wallet,
        createdAt,
        updatedAt,
        username,
      } = profile;

      return (
        <Card className="max-w-md mx-auto shadow-md rounded-lg">
          {/* Name */}
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Username</h3>
              <p className="text-sm text-muted-foreground">{username}</p>
            </div>
            {/* Nationality */}
            <div>
              <h3 className="text-sm font-semibold">Nationality</h3>
              <p className="text-sm text-muted-foreground">{nationality}</p>
            </div>

            {/* Role */}
            <div>
              <h3 className="text-sm font-semibold">Role</h3>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>

            {/* Wallet */}
            <div>
              <h3 className="text-sm font-semibold">Wallet Balance</h3>
              <p className="text-sm text-muted-foreground">${wallet}</p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold">Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Mobile:</strong> {mobile}
              </p>
            </div>

            {/* Date of Birth */}
            <div>
              <h3 className="text-sm font-semibold">Date of Birth</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(dob).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-sm font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>

            {/* Job Title (conditionally rendered) */}
            {jobTitle && (
              <div>
                <h3 className="text-sm font-semibold">Job Title</h3>
                <p className="text-sm text-muted-foreground">{jobTitle}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <CreateDialog
                form={
                  <TouristProfile profile={profile} onRefresh={fetchProfile} />
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
      {isTourGuide && <div>{profile && <TourGuideCard />}</div>}
      {isAdvertiser && <div>{profile && <AdvCard />}</div>}
      {isSeller && <div>{profile && <SellerCard />}</div>}
      {isTourist && <div>{profile && <TouristCard />}</div>}
    </div>
  );
}
