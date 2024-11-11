import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import NewTouristForm from "@/components/forms/NewTouristForm";
import NewSellerForm from "@/components/forms/NewSellerForm";
import registration from "/assets/images/registration.jpg";
import registration2 from "/assets/images/registeration2.jpg";
import axios from "axios";
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
    <div className="flex ">
      <img className="h-svh " src={registration2} />
      {type == "" && (
        <div className="flex flex-1 justify-center items-center">
          <Button onClick={() => setType("Tourist")}>Sign up as Tourist</Button>
          <Button onClick={() => setType("TourguideAdvertiserSeller")}>
            Sign up as Tour Guide / Advertiser / Seller
          </Button>
        </div>
      )}

      {type == "Tourist" && (
        <div className="flex flex-col justify-center">
          <Button onClick={() => setType("")}>Back</Button>
          <div className="py-4 px-10 border border-red-500 rounded-2xl">
            <h1 className="text-2xl">Sign up</h1>
            <NewTouristForm submitFunction={createNewTourist} />
          </div>
        </div>
      )}
      {type == "TourguideAdvertiserSeller" && (
        <div>
          <Button onClick={() => setType("")}>Back</Button>

          <NewSellerForm submitFunction={createNewTourguideSellerAdvertiser} />
        </div>
      )}
    </div>
  );
}
