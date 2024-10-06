import { createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Layout from "@/components/layout/Layout";
import ItinerariesPage from "@/pages/ItinerariesPage";
import MyProfilePage from "@/pages/MyProfilePage";
import AdminPage from "@/pages/AdminPage";
import SingleItineraryPage from "@/pages/SingleItineraryPage";

import ActivitiesPage from "@/pages/ActivitiesPage";
import HistoricalPage from "@/pages/HistoricalPage";
import ActivitiesTourists from "@/pages/ActivitiesTouristsPage";
import HistoricalTourists from "@/pages/HistoricalPageTourists";
import MarketplacePage from "@/pages/MarketplacePage";
import RegistrationPage from "@/pages/RegistrationPage";
const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<SingleItineraryPage />} />
    <Route path="itineraries" element={<ItinerariesPage />} />
    <Route path="profile" element={<MyProfilePage />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="activities" element={<ActivitiesPage/>}/>
    <Route path="historical" element={<HistoricalPage/>}/>
    <Route path="marketplace" element={<MarketplacePage/>}/>
    <Route path="RegistrationPage" element={<RegistrationPage/>}/>    
    <Route path="activitiesTourists" element={<ActivitiesTourists />} />
    <Route path="historicalTourists" element={<HistoricalTourists />} />
    <Route path="itineraryfullpage" element={<SingleItineraryPage/>}/>
  </Route>,
);

export default routes;
