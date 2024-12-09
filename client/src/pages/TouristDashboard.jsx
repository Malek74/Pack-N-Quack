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
  ChartNoAxesCombined,
  Gem,
  MapPinHouse,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";
import GuideButton from "@/components/guideComponents/popMessage";

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
    {
      label: "Sales Report",
      icon: ChartNoAxesCombined,
      path: "sales-report",
    },
  ];
  const advertiserItems = [
    {
      label: "Sales Report",
      icon: ChartNoAxesCombined,
      path: "sales-report",
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
      label: "Transactions",
      icon: Gift,
      path: "transactions",
    },
    {
      label: "Activity Bookings",
      icon: Calendar,
      path: "activitiy-bookings",
    },
    {
      label: "Itinerary Bookings",
      icon: Calendar,
      path: "itinerary-bookings",
    },
    {
      label: "Hotels and Flights Bookings",
      icon: Plane,
      path: "booked",
    },
    {
      label: "Rate Tour Guides",
      icon: UserRoundPen,
      path: "tour-guides",
    },
    {
      label: "Rate Itineraries attended",
      icon: UserRoundPlus,
      path: "itineraries-made",
    },
    {
      label: "Rate Event/Activity attended",
      icon: UserRoundPlus,
      path: "activity-attended",
    },
    {
      label: "Orders",
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
    console.log(userType);
    if (isTourist) {
      items = [...items, ...touristSidebarItems];
      setSidebarItems(items);
    }
    if (isSeller) {
      items = [...items, ...sellerItems];
      setSidebarItems(items);
    }
    if (isAdvertiser || isTourGuide){
      items = [...items, ...advertiserItems];
      setSidebarItems(items);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userId,
    userType,
    isTourGuide,
    isSeller,
    isAdvertiser,
    isTourist,
    isTourismGovernor,
  ]);
  if (sidebarItems && userType) {
    return (
      <div className="mx-52 my-8 flex rounded-xl border border-gray-300">
        <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 px-4 py-8 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex flex-1">
                <nav className="flex flex-1 flex-col items-start px-2 text-sm font-medium lg:px-4">
                  <div className="flex flex-col">
                    {sidebarItems.map(({ label, icon: Icon, path }) => (
                      <Button
                        key={label}
                        variant="ghost"
                        onClick={() => handleSectionChange(label, path)}
                        className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                          activeSection === label
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
          <div className="flex h-full flex-1 flex-col">
            <Outlet />
          </div>
        </div>

        <GuideButton guideMessage={"Navigating the webiste"} />
      </div>
    );
  }
}
