import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/assets/icons/logo.png";
import TourGuides from "@/components/TourGuides";

import {
  Bell,
  LogOut,
  UserRoundPlus,
  Globe,
  UserRoundPen,
  CircleUser,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import ItinerariesMade from "@/components/ItinerariesMade";
import ActivityAttended from "@/components/ActivityAttended";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
export default function TouristDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Users");

  // Function to render the correct component based on the active section
  const renderSection = () => {
    switch (activeSection) {
      case "Tour Guides":
        return <TourGuides />;
      case "Itineraries made":
        return <ItinerariesMade />;
      case "Event/Activity attended":
        return <ActivityAttended />;
      
      default:
        return <TouristDashboard />;
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              to="/admin"
              className="text-lg font-bold flex items-center gap-3"
            >
              <img src={logo} className="w-6" />
              Pack n Quack
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>

          <div className="flex flex-1">
            <nav className="flex flex-1 flex-col items-start px-2 text-sm font-medium lg:px-4">
              {/* <h1>Admin</h1> */}
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Tour Guides")}
                  className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Tour Guides"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <UserRoundPen className="h-4 w-4" />
                  Tour Guides
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Itineraries made")}
                  className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Itineraries made"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <UserRoundPlus className="h-4 w-4" />
                  Itineraries made
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Event/Activity attended")}
                  className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Event/Activity attended"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <UserRoundPlus className="h-4 w-4" />
                  Event/Activity attended
                </Button>

                
                
              </div>
              <div className="pt-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className={
                    "flex items-center gap-3 justify-start rounded-lg px-3 py-2 transition-all text-muted-foreground hover:text-primary"
                  }
                >
                  <Globe className="h-4 w-4" />
                  Rest of website
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Breadcrumb className="flex-1 hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/admin">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>{activeSection}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => console.log("hi")}
                    className={
                      "hover:text-destructive flex items-center gap-3 justify-start rounded-lg transition-all text-[#f56f6f]"
                    }
                  >
                    <LogOut className="h-3 w-3" />
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="px-8">{renderSection()}</div>
      </div>
      {/* Main content */}
    </div>
  );
}
