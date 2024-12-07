import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import DropDownMenuTourist from "./components/DropDownMenuTourists";
import logo from "/assets/icons/logo.png";
import DropDownMenuBook from "./components/DropDownMenuBook";

import ComboboxCurrency from "./components/ComboboxCurrency";
import DropDownMenuTGSADV from "./components/DropDownMenuTGSADV";
import { useUser } from "@/context/UserContext";
export default function Header() {
  const location = useLocation(); // Hook to get current page location
  const { userType, userId, logout } = useUser();

  const isAdmin = userType === "Admin";
  const isTourist = userType === "Tourist";
  const isAdvertiser = userType === "Advertiser";
  const isSeller = userType === "Seller";
  const isTourGuide = userType === "Tour Guide";
  const isTourismGovernor = userType === "Tourism Governer";
  const isLoggedIn = userId != null;
  // Function to determine if the current path matches the link's path
  const isActive = (path) => location.pathname === path;

  return (
    <header className="container mx-auto flex py-4">
      <nav className="flex w-full items-center justify-between">
        {/* Logo on the left */}
        <Link to="/" className="text-xl font-bold flex items-center gap-3">
          <img src={logo} className="w-8" />
          Pack n' Quack
        </Link>

        {/* Centered Navigation Links */}
        <ul className="flex justify-center mx-auto">
          <Button asChild variant="link">
            <li>
              <Link to="/" className={isActive("/") ? "text-yellow-500" : ""}>
                Home
              </Link>
            </li>
          </Button>

          {/* <Button asChild variant="link">
            <li>
              <Link
                to="/about"
                className={isActive("/about") ? "text-yellow-500" : ""}
              >
                About Us
              </Link>
            </li>
          </Button> */}

          {/* <Button asChild variant="link">
            <li>
              <Link
                to="/contact"
                className={isActive("/contact") ? "text-yellow-500" : ""}
              >
                Contact
              </Link>
            </li>
          </Button> */}

          <Button asChild variant="link">
            <li>
              <Link
                to="/marketplace"
                className={isActive("/marketplace") ? "text-yellow-500" : ""}
              >
                Marketplace
              </Link>
            </li>
          </Button>

          <Button asChild variant="link">
            <li
              className={
                isActive("/itineraries")
                  ? "text-yellow-500"
                  : isActive("/activities")
                  ? "text-yellow-500"
                  : isActive("/historical")
                  ? "text-yellow-500"
                  : ""
              }
            >
              <DropDownMenuTGSADV location={location} />
            </li>
          </Button>

          <Button asChild variant="link">
            <li
              className={
                isActive("/itinerariesTourists")
                  ? "text-yellow-500"
                  : isActive("/activitiesTourists")
                  ? "text-yellow-500"
                  : isActive("/historicalTourists")
                  ? "text-yellow-500"
                  : ""
              }
            >
              <DropDownMenuTourist />
            </li>
          </Button>

          <Button asChild variant="link">
            <li
              className={
                isActive("/bookingFlight")
                  ? "text-yellow-500"
                  : isActive("/bookingHotel")
                  ? "text-yellow-500"
                  : isActive("/transportations")
                  ? "text-yellow-500"
                  : ""
              }
            >
              <DropDownMenuBook location={location} />
            </li>
          </Button>

          <Button asChild variant="link">
            <li
              className={
                isActive("/itineraries")
                  ? "text-yellow-500"
                  : isActive("/activities")
                  ? "text-yellow-500"
                  : isActive("/historical")
                  ? "text-yellow-500"
                  : ""
              }
            ></li>
          </Button>
        </ul>

        <ul className="flex gap-2">
          <li>
            <ComboboxCurrency />
          </li>
          {!isLoggedIn ? (
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
                <Button variant="link" onClick={logout}>
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
