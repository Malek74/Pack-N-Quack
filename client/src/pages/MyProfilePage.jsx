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
import AvatarUploader from "@/components/shared/AvatarUploader";
import FileUploader from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/button";
import DialogTerms from "@/components/shared/DialogTerms";
import { Mail, Phone } from "lucide-react";
export default function MyProfilePage() {
  const { toast } = useToast();
  const {
    userId,
    userType,
    isTourGuide,
    isSeller,
    isAdvertiser,
    isTourist,
    isTourismGovernor,
  } = useUser();

  const [profile, setProfile] = useState();

  const getEndpoint = (userType) => {
    switch (userType) {
      case "Admin":
        return "admins";

      case "Advertiser":
        return "advertisers";

      case "Seller":
        return "sellers";

      case "Tourist":
        return "tourist";

      case "Tour Guide":
        return "tourGuide";
    }
  };

  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [file1, setFile1] = useState([]);
  const [file2, setFile2] = useState([]);

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("documents", file1[0]);
    formData.append("documents", file2[0]);
    formData.append("userType", userType);
    try {
      const response = await axios.post(
        `/api/upload/documents/${userId}`,
        formData
      );
      console.log(response);
      toast({
        title: "YAY!",
        description: "Documents uploaded successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: error.response.data.message,
        description: error.response.data.error,
        variant: "destructive",
      });
    }
  };

  const handleAcceptTermsAdvertiser = async () => {
    try {
      const response = await axios.put(`/api/advertisers/terms/${userId}`);
      console.log(response.data);
      toast({
        title: "YAY!",
        description: "Terms accepted successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: error.response.data.message,
        description: error.response.data.error,
        variant: "destructive",
      });
    }
  };
  const handleAcceptTermsSeller = async () => {
    try {
      const response = await axios.put(`/api/sellers/terms/${userId}`);
      console.log(response.data);
      toast({
        title: "YAY!",
        description: "Terms accepted successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: error.response.data.message,
        description: error.response.data.error,
        variant: "destructive",
      });
    }
  };
  const handleAcceptTermsTourGuide = async () => {
    try {
      const response = await axios.put(`/api/tourGuide/terms/${userId}`);
      console.log(response.data);
      toast({
        title: "YAY!",
        description: "Terms accepted successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: error.response.data.message,
        description: error.response.data.error,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const response = await axios.post(`/api/upload/fetchImages/`, {
          userType: userType,
        });
        console.log(response.data);
        setCroppedImageUrl(response.data.image);
      } catch (e) {
        console.error(e);
      }
    };
    getAvatar();
  }, [userId, userType]);

  const fetchProfile = (endpoint) => {
    axios
      .get(`api/${endpoint}`)
      .then((response) => {
        setProfile(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const endpoint = getEndpoint(userType);
    if (endpoint != undefined) fetchProfile(endpoint); // Initial fetch when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userType]);

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
        uploadedFiles,
        hasAcceptedTerms,
      } = profile;

      return (
        <Card className="overflow-hidden rounded-xl border border-gray-200 px-0 shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-400 p-6 text-white">
            <div className="flex items-center space-x-4">
              {/* Badge */}
              {uploadedFiles.images.length > 0 ? (
                <img
                  src={uploadedFiles?.images[0]}
                  alt="profile photo"
                  className="w-20 rounded-full"
                />
              ) : (
                <div className="flex-shrink-0">
                  <AvatarUploader
                    croppedImage={croppedImage}
                    setCroppedImage={setCroppedImage}
                    croppedImageUrl={croppedImageUrl}
                  />
                </div>
              )}
              {/* Company Name */}
              <div>
                <h1 className="text-3xl font-bold">{username}</h1>
                <p className="text-sm text-gray-200">{companyName}</p>
                <Badge
                  variant={isAccepted ? "success" : "destructive"}
                  className="px-4 py-1"
                >
                  {isAccepted ? "Accepted" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <CardContent className="space-y-6 p-6">
            {/* About Section */}
            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-700">
                About
              </h3>
              <div className="text-sm text-gray-600">
                <p>{description}</p>
              </div>
            </div>

            {/* Establishment Date */}
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-700">Established:</h3>
              <p className="text-sm text-gray-700">
                {new Date(establishmentDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Divider */}
            <hr className="border-gray-300" />

            {/* Contact Section */}
            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-700">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <strong>Hotline:</strong> <span>{hotline}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <strong>Website:</strong>
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {website.replace("https://", "").replace("www.", "")}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <strong>Email:</strong> <span>{email}</span>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="flex flex-col space-y-4">
              {uploadedFiles.documents.length > 0 ? (
                <h2 className="text-sm text-gray-600">
                  You already uploaded your documents
                </h2>
              ) : (
                <div className="space-y-4">
                  <h3 className="mb-3 text-xl font-semibold text-gray-700">
                    Upload ID
                  </h3>
                  <FileUploader
                    filesUploaded={file1}
                    setFilesUploaded={setFile1}
                    fileToUpload="ID"
                  />
                  <h3 className="mb-3 text-xl font-semibold text-gray-700">
                    Upload Taxation Registry Card
                  </h3>
                  <FileUploader
                    filesUploaded={file2}
                    setFilesUploaded={setFile2}
                    fileToUpload="Taxation Registry Card"
                  />
                  <Button
                    className="self-center"
                    type="button"
                    onClick={handleFileUpload}
                  >
                    Upload Files
                  </Button>
                </div>
              )}
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
              {renderDeleteAccountChangePassword()}
            </div>
          </CardContent>

          {/* Terms and Conditions Section */}
          {isAccepted && !hasAcceptedTerms && (
            <div className="flex flex-col items-center justify-center p-4">
              <DialogTerms />
              <Button type="button" onClick={handleAcceptTermsAdvertiser}>
                Accept Terms
              </Button>
            </div>
          )}
        </Card>
      );
    }

    return null;
  }

  // Tour Guide Profile Card (TourGuideCard)
  function TourGuideCard() {
    if (!profile) return null;

    const {
      previousWork,
      experienceYears,
      email,
      username,
      mobile,
      isAccepted,
      hasAcceptedTerms,
      uploadedFiles,
    } = profile;

    return (
      <Card className="overflow-hidden rounded-xl border border-gray-200 px-0 shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white">
          <div className="flex items-center space-x-4">
            {/* Badge */}
            {uploadedFiles.images.length > 0 ? (
              <img
                src={uploadedFiles?.images[0]}
                alt="profile photo"
                className="w-20 rounded-full"
              />
            ) : (
              <div className="flex-shrink-0">
                <AvatarUploader
                  croppedImage={croppedImage}
                  setCroppedImage={setCroppedImage}
                  croppedImageUrl={croppedImageUrl}
                />
              </div>
            )}
            {/* Username */}
            <div>
              <h1 className="text-3xl font-bold">{username}</h1>
              <Badge
                variant={isAccepted ? "success" : "destructive"}
                className="px-4 py-1"
              >
                {isAccepted ? "Accepted" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <CardContent className="space-y-6 p-6">
          {/* Experience Section */}
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-700">
              Experience
            </h3>
            <p className="text-sm text-gray-600">
              {experienceYears} years of experience
            </p>
          </div>

          {/* Previous Work Section */}
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-700">
              Previous Work
            </h3>
            <div className="space-y-2">
              {Array.isArray(previousWork) && previousWork.length > 0 ? (
                previousWork.map((work, index) => (
                  <div key={index} className="rounded-lg border p-2">
                    <p className="text-sm font-semibold">{work.title}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Company:</strong> {work.company}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Duration:</strong>{" "}
                      {work.duration.length > 0
                        ? `${new Date(
                            work.duration[0]
                          ).toLocaleDateString()} - ${new Date(
                            work.duration[1]
                          ).toLocaleDateString()}`
                        : "Duration not available"}
                    </p>
                    <p className="text-sm text-gray-600">{work.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  No previous work data available.
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-700">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2">
              <div>
                <strong>Email:</strong> {email}
              </div>
              <div>
                <strong>Mobile:</strong> {mobile}
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            {uploadedFiles.documents.length > 0 ? (
              <h3 className="text-sm text-gray-600">
                You already uploaded your documents
              </h3>
            ) : (
              <div className="space-y-4">
                <h3 className="mb-3 text-xl font-semibold text-gray-700">
                  Upload ID
                </h3>
                <FileUploader
                  filesUploaded={file1}
                  setFilesUploaded={setFile1}
                  fileToUpload="ID"
                />
                <h3 className="mb-3 text-xl font-semibold text-gray-700">
                  Upload Taxation Registry Card
                </h3>
                <FileUploader
                  filesUploaded={file2}
                  setFilesUploaded={setFile2}
                  fileToUpload="Taxation Registry Card"
                />
                <Button
                  className="self-center"
                  type="button"
                  onClick={handleFileUpload}
                >
                  Upload Files
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <CreateDialog
              form={
                <TourGuideProfile profile={profile} onRefresh={fetchProfile} />
              }
            />
            {renderDeleteAccountChangePassword()}
          </div>
        </CardContent>

        {/* Terms and Conditions */}
        {isAccepted && !hasAcceptedTerms && (
          <div className="flex flex-col items-center justify-center p-4">
            <DialogTerms />
            <Button type="button" onClick={handleAcceptTermsTourGuide}>
              Accept Terms
            </Button>
          </div>
        )}
      </Card>
    );
  }

  function SellerCard() {
    if (!profile) return null;

    const {
      email,
      username,
      isAccepted,
      description,
      uploadedFiles,
      hasAcceptedTerms,
    } = profile;

    return (
      <Card className="overflow-hidden rounded-xl border border-gray-200 px-0 shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="h-20 w-20 overflow-hidden rounded-full bg-white">
              {uploadedFiles.images.length > 0 ? (
                <img
                  src={uploadedFiles?.images[0]}
                  alt="profile photo"
                  className="w-20 rounded-full"
                />
              ) : (
                <div className="flex-shrink-0">
                  <AvatarUploader
                    croppedImage={croppedImage}
                    setCroppedImage={setCroppedImage}
                    croppedImageUrl={croppedImageUrl}
                  />
                </div>
              )}
            </div>

            {/* Username and Status */}
            <div>
              <h1 className="text-3xl font-bold">{username}</h1>
              <Badge
                variant={isAccepted ? "success" : "destructive"}
                className="mt-2 px-4 py-1"
              >
                {isAccepted ? "Accepted" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <CardContent className="space-y-6 p-6">
          {/* Description */}
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-700">
              Description
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-700">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div>
                <strong>Email:</strong> {email}
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            {uploadedFiles.documents.length > 0 ? (
              <h3 className="text-sm text-gray-600">
                You already uploaded your documents
              </h3>
            ) : (
              <div className="space-y-4">
                <h3 className="mb-3 text-xl font-semibold text-gray-700">
                  Upload ID
                </h3>
                <FileUploader
                  filesUploaded={file1}
                  setFilesUploaded={setFile1}
                  fileToUpload="ID"
                />
                <h3 className="mb-3 text-xl font-semibold text-gray-700">
                  Upload Taxation Registry Card
                </h3>
                <FileUploader
                  filesUploaded={file2}
                  setFilesUploaded={setFile2}
                  fileToUpload="Taxation Registry Card"
                />
                <Button
                  className="self-center"
                  type="button"
                  onClick={handleFileUpload}
                >
                  Upload Files
                </Button>
              </div>
            )}
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
            {renderDeleteAccountChangePassword()}
          </div>
        </CardContent>

        {/* Terms and Conditions */}
        {isAccepted && !hasAcceptedTerms && (
          <div className="flex flex-col items-center justify-center p-4">
            <DialogTerms />
            <Button type="button" onClick={handleAcceptTermsSeller}>
              Accept Terms
            </Button>
          </div>
        )}
      </Card>
    );
  }
  function TouristCard() {
    if (profile) {
      const { name, mobile, dob, email, nationality, role, wallet, username } =
        profile;

      return (
        <Card className="h-full overflow-hidden rounded-xl border border-gray-200 px-0 shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-skyblue p-6 text-white">
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <div className="h-24 w-24 flex-shrink-0 rounded-full bg-white">
                <img
                  src={`https://ui-avatars.com/api/?name=${name}&background=random`}
                  alt={`${name}'s profile`}
                  className="h-full w-full rounded-full object-cover"
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
          <CardContent className="space-y-6 p-6">
            {/* About Section */}
            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-700">
                About
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2">
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
              <h3 className="mb-3 text-xl font-semibold text-gray-700">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Mail />
                  <span>{email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone />
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
              {renderDeleteAccountChangePassword()}
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  function renderDeleteAccountChangePassword() {
    return (
      <div className="flex flex-row space-x-2">
        {/* Edit password action Button */}
        <div className="flex space-x-2">
          <CreateDialog
            changePassword
            form={<ChangePassword profile={profile} onRefresh={fetchProfile} />}
          />
        </div>

        {/* Request account to be deleted action Button */}
        <div className="flex space-x-2">
          <RequestAccDelete onRefresh={fetchProfile} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {isTourGuide && profile && <TourGuideCard />}
      {isAdvertiser && profile && <AdvCard />}
      {isSeller && profile && <SellerCard />}
      {isTourist && profile && <TouristCard />}
    </div>
  );
}
