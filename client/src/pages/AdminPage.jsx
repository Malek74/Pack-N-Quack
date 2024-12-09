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
  Trash2,
  File,
  ChartNoAxesCombined,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate, Outlet } from "react-router-dom";

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
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import ComboboxCurrency from "@/components/layout/components/ComboboxCurrency";

const sidebarItems = [
  {
    label: "Manage Accounts",
    icon: UserRoundPen,
    section: "Users",
    path: "users",
  },
  {
    label: "Account Delete Requests",
    icon: Trash2,
    section: "Delete Requests",
    path: "delete-requests",
  },
  {
    label: "Document Review",
    icon: File,
    section: "Document Review",
    path: "document-review",
  },
  {
    label: "Tourism Governors",
    icon: UserRoundPlus,
    section: "Tourism Governors",
    path: "tourism-governors",
  },
  {
    label: "Admins",
    icon: UserRoundPlus,
    section: "Admins",
    path: "admins",
  },
  {
    label: "Activity Categories",
    icon: TableOfContents,
    section: "Activity Categories",
    path: "activity-categories",
  },
  {
    label: "Activity Tags",
    icon: Tags,
    section: "Activity Tags",
    path: "activity-tags",
  },
  {
    label: "Itinerary Tags",
    icon: Tags,
    section: "Itinerary Tags",
    path: "itinerary-tags",
  },
  {
    label: "Products",
    icon: Package,
    section: "Products",
    path: "products",
  },
  {
    label: "Itineraries",
    icon: TentTree,
    section: "Itineraries",
    path: "itineraries",
  },
  {
    label: "Sales Report",
    icon: ChartNoAxesCombined,
    section: "Sales Report",
    path: "sales-report",
  },
  {
    label: "Complaints",
    icon: Angry,
    section: "Complaints",
    path: "complaints",
  },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Users");
  const { logout } = useUser();
  const handleSectionChange = (section, path) => {
    setActiveSection(section);
    navigate(path);
  };
  const logoutFunc = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              to="/admin"
              className="flex items-center gap-3 text-lg font-bold"
            >
              <img src={logo} className="w-6" alt="logo" />
              <h1>Pack n' Quack</h1>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>

          <div className="flex flex-1">
            <nav className="flex flex-1 flex-col items-start px-2 text-sm font-medium lg:px-4">
              <div className="flex flex-col">
                {sidebarItems.map(({ label, icon: Icon, section, path }) => (
                  <Button
                    key={section}
                    variant="ghost"
                    onClick={() => handleSectionChange(section, path)}
                    className={`flex justify-start items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      activeSection === section
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
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
      {/* Main content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Breadcrumb */}
          <Breadcrumb className="hidden flex-1 md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/admin">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {activeSection === "Single Complaint"
                    ? "Complaints"
                    : activeSection}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex gap-4">
          <ComboboxCurrency />

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
                    onClick={logoutFunc}
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
        <div className="px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
