import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import DropDownMenuTourist from "./components/DropDownMenuTourists";
import logo from "/assets/icons/logo.png";
import DropDownMenuBook from "./components/DropDownMenuBook";
import { ShoppingCart } from "lucide-react";
import ComboboxCurrency from "./components/ComboboxCurrency";
import DropDownMenuTGSADV from "./components/DropDownMenuTGSADV";
import { Label } from "../ui/label";
import Notifications from "../notifications/Notifications";

import { useUser } from "@/context/UserContext";
export default function Header() {
  const location = useLocation(); // Hook to get current page location
  const {
    userType,
    userId,
    logout,
    isTourGuide,
    isSeller,
    isAdvertiser,
    isTourist,
    isTourismGovernor,
    isGuest,
    isLoggedIn
  } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  // Function to determine if the current path matches the link's path
  const isActive = (path) => location.pathname === path;
  console.log(userId);
  return (
    <header className="container mx-auto flex py-4">
      <nav className="flex w-full items-center justify-between">
        {/* Logo on the left */}
        <Link to="/" className="flex items-center gap-3 text-xl font-bold">
          <img src={logo} className="w-8" />
          Pack n' Quack
        </Link>

        {/* Centered Navigation Links */}
        <ul className="mx-auto flex justify-center">
          <li>
            <Button asChild variant="link">
              <Link to="/" className={isActive("/") ? "text-yellow-500" : ""}>
                Home
              </Link>
            </Button>
          </li>

          {(isTourist || isSeller || isGuest) && (
            <li>
              <Button asChild variant="link">
                <Link
                  to="/marketplace"
                  className={isActive("/marketplace") ? "text-yellow-500" : ""}
                >
                  Marketplace
                </Link>
              </Button>
            </li>
          )}

          {isTourGuide && (
            <li>
              <Button asChild variant="link">
                <Link
                  to="/itineraries"
                  className={isActive("/itineraries") ? "text-yellow-500" : ""}
                >
                  Itineraries
                </Link>
              </Button>
            </li>
          )}

          {isTourismGovernor && (
            <li>
              <Button asChild variant="link">
                <Link
                  to="/historical"
                  className={isActive("/historical") ? "text-yellow-500" : ""}
                >
                  Historical Places
                </Link>
              </Button>
            </li>
          )}

          {(isTourist || isGuest) && (
            <li>
              <Button variant="link">
                <DropDownMenuTourist />
              </Button>
            </li>
          )}

          <Button asChild variant="link">
            <li>
              <DropDownMenuBook location={location} />
            </li>
          </Button>
        </ul>
        {isLoggedIn && (
          <div className="px-4">
            <Notifications />
          </div>
        )}

        <ul className="flex gap-2">
          {isTourist && isLoggedIn && (
            <li>
              <Button asChild variant="link">
                <Link
                  to="/cart"
                  className={isActive("/cart") ? "text-yellow-500" : ""}
                >
                  <ShoppingCart />
                </Link>
              </Button>
            </li>
          )}

          <li>
            <ComboboxCurrency />
          </li>
          {userId == null ? (
            <>
              <li>
                <Button asChild variant="ghost">
                  <Link to="/login">Log in</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="default" className="bg-primary">
                  <Link to="/register">Sign up</Link>
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button asChild variant="link">
                  <Link
                    to="/touristDashboard/profile"
                    className={
                      isActive("/touristDashboard") ? "text-yellow-500" : ""
                    }
                  >
                    Profile
                  </Link>
                </Button>
              </li>
              <li>
                {/* THIS IS TEMPORARY */}
                <Button variant="link" onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
