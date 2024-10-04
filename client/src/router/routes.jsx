import { createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import Layout from "@/components/layout/Layout";
import MyProfilePage from "@/pages/MyProfilePage";
import AdminPage from "@/pages/AdminPage";
import Activities from "@/pages/ActivitiesPage";
import Historical from "@/pages/HistoricalPage";
import ActivitiesTourists from "@/pages/ActivitiesTouristsPage";
import HistoricalTourists from "@/pages/HistoricalPageTourists";

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="profile" element={<MyProfilePage />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="activities" element={<Activities/>}/>
    <Route path="historical" element={<Historical/>}/>
    <Route path="ActivitiesTourists" element={<ActivitiesTourists/>}/>
    <Route path="HistoricalTourists" element={<HistoricalTourists/>}/>

    
  </Route>,
);

export default routes;
