import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserRound, UserRoundPlus, UserRoundPen, Package } from "lucide-react";
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
  return (
    <div className="mx-52 border border-gray-300 rounded-xl my-8">
      <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block px-4 py-8">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex flex-1">
              <nav className="flex flex-1 flex-col items-start px-2 text-sm font-medium lg:px-4">
                {/* <h1>Admin</h1> */}
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    onClick={() => handleSectionChange("My Profile", "profile")}
                    className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      activeSection === "My Profile"
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <UserRound className="h-4 w-4" />
                    My Profile
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleSectionChange("Tour Guides", "tour-guides")
                    }
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
                    onClick={() =>
                      handleSectionChange(
                        "Itineraries made",
                        "itineraries-made"
                      )
                    }
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
                    onClick={() =>
                      handleSectionChange(
                        "Event/Activity attended",
                        "activity-attended"
                      )
                    }
                    className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      activeSection === "Event/Activity attended"
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <UserRoundPlus className="h-4 w-4" />
                    Event/Activity attended
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleSectionChange("Order History", "order-history")
                    }
                    className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      activeSection === "Order History"
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    Order History
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="">
            <Outlet />
          </div>
        </div>
        {/* Main content */}
      </div>
    </div>
  );
}
