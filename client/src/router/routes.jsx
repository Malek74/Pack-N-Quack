import { createRoutesFromElements, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import Layout from "@/components/layout/Layout";
import Activities from "@/pages/Activities";
import Historical from "@/pages/Historical";

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="activities" element={<Activities/>}/>
    <Route path="historical" element={<Historical/>}/>
    
  </Route>,
);

export default routes;
