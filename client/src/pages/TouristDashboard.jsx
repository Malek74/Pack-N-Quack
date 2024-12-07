import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  UserRound,
  UserRoundPlus,
  UserRoundPen,
  Gift,
  Package,
  Angry,
  Plane,
  Gem,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TouristDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState();

  const handleSectionChange = (section, path) => {
    setActiveSection(section);
    navigate(path);
  };

  useEffect(() => {
    handleSectionChange("My Profile", "profile");
  }, []);

  const sidebarItems = [
    {
      label: "My Profile",
      icon: UserRound,
      path: "profile",
    },
    {
      label: "Rewards and Points",
      icon: Gift,
      path: "rewards",
    },
     {
      label: "Promo codes",
      icon: Gem,
      path: "promo-codes",
    },
    {
      label: "Activity Bookings",
      icon: Plane,
      path: "activitiy-bookings",
    },
    {
      label: "Itinerary Bookings",
      icon: Plane,
      path: "itinerary-bookings",
    },
    {
      label: "Hotels and Flights Bookings",
      icon: Plane,
      path: "booked",
    },
    {
      label: "Tour Guides",
      icon: UserRoundPen,
      path: "tour-guides",
    },
    {
      label: "Itineraries made",
      icon: UserRoundPlus,
      path: "itineraries-made",
    },
    {
      label: "Event/Activity attended",
      icon: UserRoundPlus,
      path: "activity-attended",
    },
    {
      label: "Order History",
      icon: Package,
      path: "order-history",
    },
    {
      label: "My Prodcucts",
      icon: Package,
      path: "my-products",
    },
    {
      label: "Complaints",
      icon: Angry,
      path: "complaints",
    },
  ];

  return (
    <div className="mx-52 border border-gray-300 rounded-xl my-8 flex">
      <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block px-4 py-8">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex flex-1">
              <nav className="flex flex-1 flex-col items-start px-2 text-sm font-medium lg:px-4">
                <div className="flex flex-col">
                  {sidebarItems.map(({ label, icon: Icon, path }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      onClick={() => handleSectionChange(label, path)}
                      className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${activeSection === label
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
