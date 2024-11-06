import TouristProfile from "@/components/forms/TouristProfile";
import TourGuideProfile from "@/components/forms/TourGuideProfile";
import AdvertiserProfile from "@/components/forms/AdvertiserProfile";
import SellerProfileD from "@/components/forms/SellerProfile";
import CreateDialog from "@/components/shared/CreateDialog";
import ChangePassword from "@/components/forms/ChangePassword";
import RequestAccDelete from"@/components/forms/RequestAccDelete";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import SellerProfileDialog from "@/components/forms/SellerProfileDialog";
import DeleteButton from "@/components/shared/DeleteButton";
export default function MyProfilePage() {
  const usertype = "Tourist"; // This value will determine which component to render
  const { toast } = useToast();

  const isTourGuide = usertype === "Tour Guide";
  const isAdvertiser = usertype === "Advertiser";
  const isSeller = usertype === "Seller";
  const isTourist = usertype === "T ourist";
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
  }

function renderDeleteAccountChangePassword() {
  return (
    <div>
      {/* Edit password action Button */}
      <div className="flex space-x-2">
        <CreateDialog
          changePassword
          form={<ChangePassword profile={profile} userType={usertype} onRefresh={fetchProfile} />}
        />
      </div>

      {/* Request account to be deleted action Button */}
      <div className="flex space-x-2">
        <RequestAccDelete onRefresh={fetchProfile} userId={userId} userType={usertype} />
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
