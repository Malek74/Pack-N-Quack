import Banner from "@/components/shared/BannerV2";
import BannerImage from "/assets/images/romanBanner.jpg";
import EditItineraryForm from "@/components/ItinerariesPage/EditItineraryForm";

export default function EditItineraryPage() {
  return (
    <div className="flex flex-col w-screen p-14 pb-0">
      <div className="relative">
        <Banner background={BannerImage} name="Edit Itinerary" />
      </div>

      <EditItineraryForm />
    </div>
  );
}
