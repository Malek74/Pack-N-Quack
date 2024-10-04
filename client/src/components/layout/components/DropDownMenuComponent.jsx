import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React from 'react'
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';

const DropDownMenuComponent = () => {
  const [label, setLabel] = useState("What to do?")
  useEffect(() => {
    switch (location.pathname) {
      case '/itineraries':
        setLabel('Itineraries');
        break;
      case '/activities':
        setLabel('Activities');
        break;
      case '/historical':
        setLabel('Historical');
        break;
      default:
        setLabel('What to do?');
    }
  }, [location.pathname]);
  return (
    <DropdownMenu>
  <DropdownMenuTrigger>{label}</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>What to do?</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem><Link to="/itineraries">Itineraries</Link></DropdownMenuItem>
    <DropdownMenuItem><Link to="/activities">Activities</Link></DropdownMenuItem>
    <DropdownMenuItem><Link to="/historical">Historical</Link></DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

  )
}

export default DropDownMenuComponent


