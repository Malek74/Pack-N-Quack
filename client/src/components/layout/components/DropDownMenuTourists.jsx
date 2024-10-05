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
import { Link } from 'react-router-dom';

const DropDownMenuTourist = () => {
  const [label, setLabel] = useState("What to do?")
  useEffect(() => {
    switch (location.pathname) {
      case '/itineraries':
        setLabel('Itineraries');
        break;
      case '/activitiesTourists':
        setLabel('Activities');
        break;
      case '/historicalTourists':
        setLabel('Historical');
        break;
      default:
        setLabel('As a Tourist');
    }
  }, [location.pathname]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{label}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>As a Tourist</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Link to="/itineraries">Itineraries</Link></DropdownMenuItem>
        <DropdownMenuItem><Link to="/activitiesTourists">Activities</Link></DropdownMenuItem>
        <DropdownMenuItem><Link to="/historicalTourists">Historical</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default DropDownMenuTourist


