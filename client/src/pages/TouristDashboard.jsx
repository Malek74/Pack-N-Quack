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
  MapPinHouse,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";
export default function TouristDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState();
  const {
    userId,
    userType,
    isTourGuide,
    isSeller,
    isAdvertiser,
    isTourist,
    isTourismGovernor,
  } = useUser();

  const commonSidebarItems = [
    {
      label: "My Profile",
      icon: UserRound,
      path: "profile",
    },
  ];

  const sellerItems = [
    {
      label: "My Products",
      icon: Package,
      path: "my-products",
    },
  ];
  const touristSidebarItems = [
    {
      label: "Rewards and Points",
      icon: Gift,
      path: "rewards",
    },

    {
      label: "Bookmarked",
      icon: Package,
      path: "bookmarked",
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
      label: "Complaints",
      icon: Angry,
      path: "complaints",
    },
    {
      label: "Addresses",
      icon: MapPinHouse,
      path: "addresses",
    },
  ];
  const handleSectionChange = (section, path) => {
    setActiveSection(section);
    navigate(path);
  };
  const [sidebarItems, setSidebarItems] = useState([]);

  useEffect(() => {
    setSidebarItems(commonSidebarItems);
    let items = [...commonSidebarItems]; // Start with common items

    if (isTourist) {
      items = [...items, ...touristSidebarItems];
      setSidebarItems(items);
    }
    if (isSeller) {
      sidebarItems.push(sellerItems);
    }
  }, [
    userId,
    userType,
    isTourGuide,
    isSeller,
    isAdvertiser,
    isTourist,
    isTourismGovernor,
    sidebarItems,
  ]);
  if (sidebarItems && userType) {
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
}
