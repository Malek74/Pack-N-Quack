import { createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Layout from "@/components/layout/Layout";
import ItinerariesPage from "@/pages/ItinerariesPage";
import MyProfilePage from "@/pages/MyProfilePage";
import AdminPage from "@/pages/AdminPage";
import SingleItineraryPage from "@/pages/SingleItineraryPage";
import ComponentTestPage from "@/pages/ComponentTestPage";
import ActivitiesPage from "@/pages/ActivitiesPage";
import HistoricalPage from "@/pages/HistoricalPage";
import ActivitiesTourists from "@/pages/ActivitiesTouristsPage";
import HistoricalTourists from "@/pages/HistoricalPageTourists";
import MarketplacePage from "@/pages/MarketplacePage";
import RegistrationPage from "@/pages/RegistrationPage";
import ErrorBoundary from "@/components/errorBoundary/ErrorBoundary";
import NotFoundPage from "@/components/errorBoundary/NotFoundPage";
import FlightBookingApp from "@/pages/FlightBookPage";
import HotelBookingApp from "@/pages/HotelBookPage";
import TouristDashboard from "@/pages/TouristDashboard";
import RamitoItineraries from "@/pages/RamitoItineraries";
import RamitoSingleItineraryPage from "@/pages/RamitoSingleItineraryPage";
import CreateItineraryPage from "@/pages/CreateItineraryPage";
import EditItineraryPage from "@/pages/EditItineraryPage";

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<SingleItineraryPage />} />
    <Route path="itineraries" element={<ItinerariesPage />} />
    <Route path="profile" element={<MyProfilePage />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="activities/:idAdv" element={<ActivitiesPage />} />
    <Route path="historical/:idTG" element={<HistoricalPage />} />
    <Route path="marketplace" element={<MarketplacePage />} />
    <Route path="RegistrationPage" element={<RegistrationPage />} />
    <Route path="activitiesTourists" element={<ActivitiesTourists />} />
    <Route path="historicalTourists" element={<HistoricalTourists />} />
    <Route path="itineraryfullpage/:id" element={<SingleItineraryPage />} />
    <Route path="componentTest" element={<ComponentTestPage />} />
    <Route path="bookingFlight" element={<FlightBookingApp />}></Route>
    <Route path="bookingHotel" element={<HotelBookingApp />}></Route>
    <Route path="ramito" element={<RamitoItineraries />}></Route>
    <Route path="ramito/:id" element={<RamitoSingleItineraryPage />}></Route>
    <Route path="createItinerary" element={<CreateItineraryPage />}></Route>
    <Route path="editItinerary/:id" element={<EditItineraryPage />}></Route>
    <Route path="touristDashboard" element={<TouristDashboard />} />
    <Route
      path="*"
      element={
        <ErrorBoundary>
          <NotFoundPage />
        </ErrorBoundary>
      }
    />
  </Route>
);

export default routes;
