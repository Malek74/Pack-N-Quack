import { useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import ActivityCategory from "@/components/ActivityCategory";
import ItineraryTags from "@/components/ItineraryTags";
import ActivityTags from "@/components/ActivityTags";
import { Link } from "react-router-dom";
import {
  Bell,
  Package,
  Tags,
  Package2,
  TableOfContents,
  UserRoundPlus,
  UserRoundPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminsList from "@/components/AdminsList";
import AdminProducts from "@/components/AdminProducts";
import GovernorsList from "@/components/GovernorsList";
export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Function to render the correct component based on the active section
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "tourismGovernors":
        return <GovernorsList />;
      case "admins":
        return <AdminsList />;
      case "activityCategories":
        return <ActivityCategory />;
      case "activityTags":
        return <ActivityTags />;
      case "itineraryTags":
        return <ItineraryTags />;
      case "adminProducts":
        return <AdminProducts />;
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
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>Admin Page</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>

          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeSection === "dashboard"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <UserRoundPen className="h-4 w-4" />
                Manage Accounts
              </button>

              <button
                onClick={() => setActiveSection("tourismGovernors")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeSection === "tourismGovernors"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <UserRoundPlus className="h-4 w-4" />
                Tourism Governors
              </button>

              <button
                onClick={() => setActiveSection("admins")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeSection === "admins"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <UserRoundPlus className="h-4 w-4" />
                Admins
              </button>

              <button
                onClick={() => setActiveSection("activityCategories")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeSection === "activityCategories"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <TableOfContents className="h-4 w-4" />
                Activity Categories
              </button>

              <button
                onClick={() => setActiveSection("activityTags")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeSection === "activityTags"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Tags className="h-4 w-4" />
                Activity Tags
              </button>
              <button
                onClick={() => setActiveSection("itineraryTags")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeSection === "itineraryTags"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Tags className="h-4 w-4" />
                Itinerary Tags
              </button>
              <button
                onClick={() => setActiveSection("adminProducts")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  activeSection === "activityCategories"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Package className="h-4 w-4" />
                Products
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">{renderSection()}</div>
    </div>
  );
}
