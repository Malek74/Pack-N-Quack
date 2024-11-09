import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import DropDownMenuComponent from "./components/DropDownMenuComponent";
import DropDownMenuTourist from "./components/DropDownMenuTourists";
import DropDownMenuProfile from "./components/DropDownMenuProfile";
import logo from "/assets/icons/logo.png";
import DropDownMenuBook from "./components/DropDownMenuBook";

import ComboboxCurrency from "./components/ComboboxCurrency";

export default function Header() {
  const location = useLocation(); // Hook to get current page location

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

          <Button asChild variant="link">
            <li>
              <Link
                to="/profile"
                className={isActive("/profile") ? "text-yellow-500" : ""}
              >
                Profile
              </Link>
            </li>
          </Button>

          <Button asChild variant="link">
            <li>
              <Link
                to="/about"
                className={isActive("/about") ? "text-yellow-500" : ""}
              >
                About Us
              </Link>
            </li>
          </Button>

          <Button asChild variant="link">
            <li>
              <Link
                to="/contact"
                className={isActive("/contact") ? "text-yellow-500" : ""}
              >
                Contact
              </Link>
            </li>
          </Button>
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
              <DropDownMenuProfile location={location} />
            </li>
          </Button>

          <Button asChild variant="link">
            <li
              className={
                isActive("/itineraries")
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
                isActive("/itineraries")
                  ? "text-yellow-500"
                  : isActive("/activities")
                    ? "text-yellow-500"
                    : isActive("/historical")
                      ? "text-yellow-500"
                      : ""
              }
            >
              <DropDownMenuBook location={location} />
            </li>
          </Button>

        </ul>

        {/* Sign In and Sign Up on the right */}
        <ul className="flex gap-2">
          <ComboboxCurrency />
          <Button asChild variant="ghost">
            <li>
              <Link to="/login">Log in</Link>
            </li>
          </Button>
          <Button asChild variant="default" className="bg-primary">
            <li>
              <Link to="/RegistrationPage">Sign up</Link>
            </li>
          </Button>
        </ul>
      </nav>
    </header>
  );
}
