import { useState } from "react";
import AdminDashboard from "@/components/adminPage/AdminDashboard";
import ActivityCategory from "@/components/adminPage/ActivityCategory";
import ItineraryTags from "@/components/adminPage/ItineraryTags";
import ActivityTags from "@/components/adminPage/ActivityTags";
import { Link } from "react-router-dom";
import logo from "/assets/icons/logo.png";

import {
  Bell,
  Package,
  Tags,
  LogOut,
  TableOfContents,
  UserRoundPlus,
  Globe,
  UserRoundPen,
  CircleUser,
  TentTree,
  Angry,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminsList from "@/components/adminPage/AdminsList";
import AdminProducts from "@/components/adminPage/AdminProducts";
import GovernorsList from "@/components/adminPage/GovernorsList";
import { useNavigate } from "react-router-dom";

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
import ItinerariesView from "@/components/adminPage/ItinerariesView";
import Complaints from "@/components/adminPage/complaints";
import OneComplain from "@/components/adminPage/OneComplain";
export default function AdminPage() {
  const navigate = useNavigate();

  //complaints page stuff ///////
  const [activeSection, setActiveSection] = useState("Users");
  const [currentComplaint, setCurrentComplaint] = useState({});

  const openComplaint = (complaint) => {
    setCurrentComplaint(complaint);
    setActiveSection("Single Complaint");
  };
  /////////////////////////////////

  // Function to render the correct component based on the active section
  const renderSection = () => {
    switch (activeSection) {
      case "Users":
        return <AdminDashboard />;
      case "Tourism Governors":
        return <GovernorsList />;
      case "Admins":
        return <AdminsList />;
      case "Activity Categories":
        return <ActivityCategory />;
      case "Activity Tags":
        return <ActivityTags />;
      case "Itinerary Tags":
        return <ItineraryTags />;
      case "Products":
        return <AdminProducts />;
      case "Itineraries":
        return <ItinerariesView />;
      case "Complaints":
        return <Complaints openComplaint={openComplaint} />;
      case "Single Complaint":
        return <OneComplain complaintID={currentComplaint._id} />;
      default:
        return <AdminDashboard />;
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
              Pack n' Quack
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
                  onClick={() => setActiveSection("Users")}
                  className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Users"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <UserRoundPen className="h-4 w-4" />
                  Manage Accounts
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Tourism Governors")}
                  className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Tourism Governors"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <UserRoundPlus className="h-4 w-4" />
                  Tourism Governors
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Admins")}
                  className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Admins"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <UserRoundPlus className="h-4 w-4" />
                  Admins
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Activity Categories")}
                  className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Activity Categories"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <TableOfContents className="h-4 w-4" />
                  Activity Categories
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Activity Tags")}
                  className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Activity Tags"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Tags className="h-4 w-4" />
                  Activity Tags
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Itinerary Tags")}
                  className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Itinerary Tags"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Tags className="h-4 w-4" />
                  Itinerary Tags
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Products")}
                  className={`flex items-center gap-3 justify-start rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Products"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  Products
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Itineraries")}
                  className={`flex items-center gap-3 justify-start rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Itineraries"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <TentTree className="h-4 w-4" />
                  Itineraries
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection("Complaints")}
                  className={`flex items-center gap-3 justify-start rounded-lg px-3 py-2 transition-all ${
                    activeSection === "Complaints" ||
                    activeSection === "Single Complaint"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Angry className="h-4 w-4" />
                  Complaints
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
                  <BreadcrumbPage>
                    {activeSection === "Single Complaint"
                      ? "Complaints"
                      : activeSection}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbItem>
              {activeSection === "Single Complaint" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentComplaint.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbItem>
                </>
              )}
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
