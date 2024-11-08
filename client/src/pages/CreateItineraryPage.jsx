import Banner from "@/components/shared/BannerV2";
import BannerImage from "/assets/images/romanBanner.jpg";
import CreateItineraryForm from "@/components/itinerariesPage/CreateItineraryForm";

export default function CreateItineraryPage() {
  return (
    <div className="flex flex-col w-screen p-14 pb-0">
      <div className="relative">
        <Banner background={BannerImage} name="Create Itinerary" />
      </div>

      <CreateItineraryForm />
    </div>
  );
}
