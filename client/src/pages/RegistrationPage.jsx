import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import NewTouristForm from "@/components/forms/NewTouristForm";
import NewSellerForm from "@/components/forms/NewSellerForm";
import registration2 from "/assets/images/registeration2.jpg";
import axios from "axios";
import GuideButton from "@/components/guideComponents/popMessage";

import { useToast } from "@/hooks/use-toast";

export default function RegistrationPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [type, setType] = useState("");

  const createNewTourist = (values) => {
    console.log("axios");
    axios
      .post("/api/tourist/", {
        name: values.name, // Default value for username
        username: values.username, // Default value for username
        email: values.email, // Default value for email
        password: values.password, // Default value for password
        mobile: values.mobileNumber, // Default value for mobile number
        nationality: values.nationality, // Default value for nationality
        role: values.status, // Default value for status dropdown
        dob: values.dob, // Default value for date of birth
        preferedFirstTag: values.preferedFirstTag,
        preferedSecondTag: values.preferedSecondTag,
        preferedFirstCategory: values.preferedFirstCategory,
        preferedSecondCategory: values.preferedSecondCategory,
      })
      .then((response) => {
        console.log("Tourist created successfully", response.data);
        toast({
          title: "Account created succesfully",
        });
        navigate("/");
      })
      .catch((error) => {
        console.error("Error creating tourist", error);
        toast({
          title: "Couldn't sign up",
          description: error.response.data.message,
          variant: "destructive", // Error variant
        });
      });
  };

  const createNewTourguideSellerAdvertiser = (values) => {
    console.log("axios");
    const endpoint =
      values.status === "Advertiser"
        ? "advertisers"
        : values.status === "Seller"
        ? "sellers"
        : "tourGuide";
    axios
      .post(`/api/${endpoint}/`, {
        username: values.username, // Default value for username
        email: values.email, // Default value for email
        password: values.password, // Default value for password
      })
      .then((response) => {
        console.log("Account created successfully", response.data);
        toast({
          title: "Account created succesfully",
        });
        navigate("/");
      })
      .catch((error) => {
        console.error("Error creating account", error);
        toast({
          title: "Couldn't sign up",
          description: error.response.data.message,
          variant: "destructive", // Error variant
        });
      });
  };
  return (
    <div className="flex h-screen min-h-max items-center justify-center bg-[url('public/assets/images/Background.jpg')] bg-cover bg-no-repeat">
      <div className="my-4 flex rounded-3xl bg-white py-4">
        {type == "" && (
          <div className="flex w-full items-center justify-center gap-16 px-20 py-20">
            <button onClick={() => setType("Tourist")} className="rounded-3xl border border-gray-400 p-8">
              <div className="flex flex-col items-center">
                <img
                  className="h-32 w-32"
                  src="/assets/images/happyDuck.png"
                ></img>
                <h1 className="text-2xl font-semibold">Sign up as</h1>
                <h1 className="text-2xl font-semibold">Tourist</h1>
              </div>
            </button>
            <button onClick={() => setType("TourguideAdvertiserSeller")} className="rounded-3xl border border-gray-400 p-8">
              <div className="flex flex-col items-center">
                <img
                  className="h-32 w-32"
                  src="/assets/images/neutralDuck.png"
                ></img>
                <h1 className="text-2xl font-semibold">Sign up as</h1>{" "}
                <h1 className="text-2xl font-semibold">Agent</h1>
              </div>
            </button>
          </div>
        )}

        {type == "Tourist" && (
          <div className="flex flex-col gap-4 py-4">
            <Button className="mx-10 self-start" onClick={() => setType("")}>
              Back
            </Button>
            <div className="mx-10 rounded-3xl">
              <NewTouristForm submitFunction={createNewTourist} />
            </div>
          </div>
        )}
        {type == "TourguideAdvertiserSeller" && (
          <div className="flex flex-col gap-4 py-4">
            <Button className="mx-10 self-start" onClick={() => setType("")}>
              Back
            </Button>
            <div className="mx-10">
              <NewSellerForm
                submitFunction={createNewTourguideSellerAdvertiser}
              />
            </div>
          </div>
        )}

        <GuideButton
          guideMessage={
            "Select your role as a tourist, tour guide, advertiser, or seller to sign up and get started."
          }
        />
      </div>
    </div>
  );
}
