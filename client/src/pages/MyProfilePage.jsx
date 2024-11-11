import TouristProfile from "@/components/forms/TouristProfile";
import TourGuideProfile from "@/components/forms/TourGuideProfile";
import AdvertiserProfile from "@/components/forms/AdvertiserProfile";
import CreateDialog from "@/components/shared/CreateDialog";
import ChangePassword from "@/components/forms/ChangePassword";
import RequestAccDelete from "@/components/forms/RequestAccDelete";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import SellerProfileDialog from "@/components/forms/SellerProfileDialog";
import { useUser } from "@/context/UserContext";
export default function MyProfilePage() {
  const { toast } = useToast();
  const { userId, userType } = useUser();
  const usertype = userType;
  const isTourGuide = usertype === "tour_guide";
  const isAdvertiser = usertype === "advertiser";
  const isSeller = usertype === "seller";
  const isTourist = usertype === "tourist";
  console.log(isTourist);
  const [profile, setProfile] = useState();
  const endpoint = "tourist";

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
        isAccepted,
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
            {renderDeleteAccountChangePassword()}
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
            {renderDeleteAccountChangePassword()}
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

            {/* Edit profile action Buttons */}
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
            {renderDeleteAccountChangePassword()}
          </CardContent>
        </Card>
      );
    }
  }
  function TouristCard() {
    if (profile) {
      const { name, mobile, dob, email, nationality, role, wallet, username } =
        profile;

      return (
        <Card className="px-0 shadow-lg border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-skyblue text-white">
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <div className="w-24 h-24 bg-white rounded-full flex-shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${name}&background=random`}
                  alt={`${name}'s profile`}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>

              {/* Name and Role */}
              <div>
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-lg font-medium">{role}</p>
                <p className="text-sm text-gray-200">@{username}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <CardContent className="p-6 space-y-6">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                About
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Nationality:</span>
                  <span>{nationality}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Date of Birth:</span>
                  <span>
                    {new Date(dob).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-300" />

            {/* Contact Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h2m4-6v6m4-6v6m-8 0h4"
                    />
                  </svg>
                  <span>{email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8h4l2-2h6l2 2h4v11H3V8z"
                    />
                  </svg>
                  <span>{mobile}</span>
                </div>
              </div>
            </div>

            {/* Edit profile action Button */}
            <div className="flex space-x-2">
              <CreateDialog
                form={
                  <TouristProfile profile={profile} onRefresh={fetchProfile} />
                }
              />
            </div>

            {renderDeleteAccountChangePassword()}
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  function renderDeleteAccountChangePassword() {
    return (
      <div>
        {/* Edit password action Button */}
        <div className="flex space-x-2">
          <CreateDialog
            changePassword
            form={
              <ChangePassword
                profile={profile}
                userType={usertype}
                onRefresh={fetchProfile}
              />
            }
          />
        </div>

        {/* Request account to be deleted action Button */}
        <div className="flex space-x-2">
          <RequestAccDelete
            onRefresh={fetchProfile}
            userId={userId}
            userType={usertype}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {isTourGuide && <div>{profile && <TourGuideCard />}</div>}
      {isAdvertiser && <div>{profile && <AdvCard />}</div>}
      {isSeller && <div>{profile && <SellerCard />}</div>}
      {isTourist && <div>{profile && <TouristCard />}</div>}
    </div>
  );
}
