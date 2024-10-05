import { Link , useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import DropDownMenuComponent from './components/DropDownMenuComponent'

export default function Header() {
  const location = useLocation(); // Hook to get current page location

  // Function to determine if the current path matches the link's path
  const isActive = (path) => location.pathname === path;

  const whatToDoMenuItems = [
    { label: "Itineraries", path: "/itineraries" },
    { label: "Activities", path: "/activities" },
  ];
  
  const user = "admin"
  return (
    <header className="container mx-auto flex py-4">
      <nav className="flex w-full items-center justify-between">
        {/* Logo on the left */}
        <Link to="/" className="text-xl font-bold">
          Pack n' Quack
        </Link>

        {/* Centered Navigation Links */}
        <ul className="flex justify-center mx-auto">
          
          <Button asChild variant="link" >
          <li>
            <Link to="/" className={isActive("/") ? "text-yellow-500" : ""}>Home</Link>
          </li>
          </Button>
          
          <Button asChild variant="link" >
          <li>
            <Link to="/profile" className={isActive("/profile") ? "text-yellow-500" : ""}>Profile</Link>
          </li>
          </Button>

          <Button asChild variant="link" >
          <li>
            <Link to="/about" className={isActive("/about") ? "text-yellow-500" : ""}>About Us</Link>
          </li>
          </Button>
          
          <Button asChild variant="link" >
          <li>
            <Link to="/contact" className={isActive("/contact") ? "text-yellow-500" : ""}>Contact</Link>
          </li>
          </Button>
          <Button asChild variant="link" >
          <li>
            <Link to="/marketplace" className={isActive("/contact") ? "text-yellow-500" : ""}>Marketplace</Link>
          </li>
          </Button>

          <Button asChild variant="link" >
          <li className={isActive("/itineraries") ? "text-yellow-500" : isActive("/activities") ? "text-yellow-500" : isActive("/historical") ? "text-yellow-500" : ""}>
            <DropDownMenuComponent location = {location} />
          </li>
          </Button>
          
          
          
        </ul>
        

        {/* Sign In and Sign Up on the right */}
        <ul className="flex gap-2"> 
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
          
          <li>
            <Link to="/profile">MyProfile</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
