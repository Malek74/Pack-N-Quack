import { createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Layout from "@/components/layout/Layout";
import MyProfilePage from "@/pages/MyProfilePage";
import AdminPage from "@/pages/AdminPage";
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
// Itineraries
import ItinerariesTouristsPage from "@/pages/ItinerariesTouristsPage";
import SingleItineraryTouristsPage from "@/pages/SingleItineraryTouristsPage";
import CreateItineraryPage from "@/pages/CreateItineraryPage";
import EditItineraryPage from "@/pages/EditItineraryPage";
import ItinerariesTourGuidePage from "@/pages/ItinerariesTourGuidePage";
import SingleItineraryTourGuidePage from "@/pages/SingleItineraryTourGuidePage";

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="profile" element={<MyProfilePage />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="activities/:idAdv" element={<ActivitiesPage />} />
    <Route path="historical/:idTG" element={<HistoricalPage />} />
    <Route path="marketplace" element={<MarketplacePage />} />
    <Route path="RegistrationPage" element={<RegistrationPage />} />
    <Route path="activitiesTourists" element={<ActivitiesTourists />} />
    <Route path="historicalTourists" element={<HistoricalTourists />} />
    <Route path="componentTest" element={<ComponentTestPage />} />
    <Route path="bookingFlight" element={<FlightBookingApp />}></Route>
    <Route path="bookingHotel" element={<HotelBookingApp />}></Route>
    <Route
      path="itinerariesTourists"
      element={<ItinerariesTouristsPage />}
    ></Route>
    <Route
      path="itinerariesTourists/:id"
      element={<SingleItineraryTouristsPage />}
    ></Route>
    <Route
      path="itineraries/:id"
      element={<ItinerariesTourGuidePage />}
    ></Route>
    <Route
      path="itinerariesTourGuide/:id"
      element={<SingleItineraryTourGuidePage />}
    ></Route>
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
