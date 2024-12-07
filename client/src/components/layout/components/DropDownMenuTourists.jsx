import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DropDownMenuTourist = () => {
  const [label, setLabel] = useState("What to do?");
  useEffect(() => {
    switch (location.pathname) {
      case "/itinerariesTourists":
        setLabel("Itineraries");
        break;
      case "/activities":
        setLabel("Activities");
        break;
      case "/historicalTourists":
        setLabel("Historical");
        break;
      default:
        setLabel("What to do?");
    }
  }, [location.pathname]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{label}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/itinerariesTourists">Itineraries</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/activities">Activities</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/historicalTourists">Historical</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenuTourist;
