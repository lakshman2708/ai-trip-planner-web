import React, { useState, useEffect } from "react";
import ReactGooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "../components/ui/input.jsx";
import { SelectBudgetOptions, SelectTravelesList } from "../constants/options.jsx";
import { Button } from "../components/ui/button.jsx";
import { toast } from "sonner";
import { generateTravelPlan } from "../service/AIModel.jsx";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { FaTruckLoading } from "react-icons/fa";
import { db } from "../service/firebaseConfig.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log("User Profile:", resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setopenDialog(false);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
      });
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log("Access Token Info:", codeResp);
      GetUserProfile(codeResp);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const OnGenerateTrip = async () => {
  const user = localStorage.getItem("user");
  if (!user) {
    setopenDialog(true);
    return;
  }
  if (!formData?.noOfDays || !formData?.location || !formData?.budget || !formData?.traveller) {
    toast("Please fill all the details.");
    return;
  }

  setLoading(true);

  try {
    const response = await generateTravelPlan({
      location: formData.location.label,
      days: formData.noOfDays,
      travellers: formData.traveller,
      budget: formData.budget,
    });

    toast("Trip generated successfully!");

    const docId = await SaveAiTrip(response); // wait for saving
    navigate('/view-trip/' + docId);          // navigate only after saving

  } catch (err) {
    console.error("Error generating trip:", err);
    toast("Failed to generate trip. Check console for details.");
  } finally {
    setLoading(false);
  }
};


  const SaveAiTrip = async (TripData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: TripData,
      userEmail: user?.email,
      id: docId
    });
    return docId;
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">Destination?</h2>
          <ReactGooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium mt-8">Number of Days</h2>
          <Input
            placeholder="Ex. 5"
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium mt-8">Budget</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.budget === item.title ? "shadow-lg border-black" : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium mt-8">Travelling With?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInputChange("traveller", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.traveller === item.people ? "shadow-lg border-black" : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button onClick={OnGenerateTrip} disabled={loading}>
          {loading ? <FaTruckLoading className="h-7 w-7 animate-spin"/> : 'Generate Trip'}
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Sign in to the App with Google authentication securely.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center mt-4">
            <img src="/logo.svg" alt="Logo" />
            <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
            <p className="text-sm text-gray-600">
              Continue with Google authentication
            </p>

            <Button onClick={login} className="w-full mt-5 flex gap-4 items-center">
              <FcGoogle className="h-7 w-7" />
              Sign In With Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
