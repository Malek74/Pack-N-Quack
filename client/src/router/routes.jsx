import { createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import Layout from "@/components/layout/Layout";
import MyProfilePage from "@/pages/MyProfilePage";
import AdminPage from "@/pages/AdminPage";
import Activities from "@/pages/Activities";

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="profile" element={<MyProfilePage />} />
    <Route path="admin" element={<AdminPage />} />
    <Route path="activities" element={<Activities/>}/>
  </Route>,
);

export default routes;
