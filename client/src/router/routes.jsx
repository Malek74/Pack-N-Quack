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
import SingleActivityPage from "@/pages/SingleActivityPage";
import PointsAndLoyalty from "@/components/dropdown/Pointsandloyality";
import SingleHistoricalPage from "@/pages/SingleHistoricalPage";
import FlightBookingApp from "@/pages/FlightBookPage";
import HotelBookingApp from "@/pages/HotelBookPage";
import TourGuides from "@/components/touristPage/TourGuides";
import ItinerariesMade from "@/components/touristPage/ItinerariesMade";
import ActivityAttended from "@/components/touristPage/ActivityAttended";
import OrderHistory from "@/components/touristPage/OrderHistory";
import TouristDashboard from "@/pages/TouristDashboard";
// Itineraries
import ItinerariesTouristsPage from "@/pages/ItinerariesTouristsPage";
import SingleItineraryTouristsPage from "@/pages/SingleItineraryTouristsPage";
import CreateItineraryPage from "@/pages/CreateItineraryPage";
import EditItineraryPage from "@/pages/EditItineraryPage";
import ItinerariesTourGuidePage from "@/pages/ItinerariesTourGuidePage";
import SingleItineraryTourGuidePage from "@/pages/SingleItineraryTourGuidePage";
import Transportation from "@/pages/TransportationPage";

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

    <Route path="activity/:id" element={<SingleActivityPage />} />
    <Route path="place/:name" element={<SingleHistoricalPage />} />
    <Route path="Pointsandloyality" element={<PointsAndLoyalty />} />
    <Route
      path="*"
      element={
        <ErrorBoundary>
          <NotFoundPage />
        </ErrorBoundary>
      }
    />
    <Route path="componentTest" element={<ComponentTestPage />} />
    <Route path="bookingFlight" element={<FlightBookingApp />}></Route>
    <Route path="bookingHotel" element={<HotelBookingApp />}></Route>
    <Route path="transportation/:idAdv" element={<Transportation />}></Route>
    <Route path="transportation" element={<Transportation />}></Route>
    <Route path="touristDashboard" element={<TouristDashboard />}>
      <Route path="profile" element={<MyProfilePage />} />
      <Route path="tour-guides" element={<TourGuides />} />
      <Route path="itineraries-made" element={<ItinerariesMade />} />
      <Route path="activity-attended" element={<ActivityAttended />} />
      <Route path="order-history" element={<OrderHistory />} />
    </Route>

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
