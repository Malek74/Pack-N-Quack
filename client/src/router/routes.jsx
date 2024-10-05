import { createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import Layout from "@/components/layout/Layout";
import ItinerariesPage from "@/pages/ItinerariesPage";
import MyProfilePage from "@/pages/MyProfilePage";
import AdminPage from "@/pages/AdminPage";
import Activities from "@/pages/Activities";
import Historical from "@/pages/Historical";
import ActivitiesTourists from "@/pages/ActivitiesTouristsPage";
import HistoricalTourists from "@/pages/HistoricalPageTourists";

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="itineraries" element={<ItinerariesPage />} />
    <Route path="profile" element={<MyProfilePage />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="activities" element={<Activities/>}/>
    <Route path="historical" element={<Historical/>}/>
    <Route path="marketplace" element={<MarketplacePage/>}/>
    <Route path="ActivitiesTourists" element={<ActivitiesTourists/>}/>
    <Route path="HistoricalTourists" element={<HistoricalTourists/>}/>    
  </Route>,
);

export default routes;
