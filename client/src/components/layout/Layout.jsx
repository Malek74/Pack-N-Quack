import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
export default function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { isLoggedIn } = useUser();
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAdminRoute && isLoggedIn && <Footer />}
    </div>
  );
}
