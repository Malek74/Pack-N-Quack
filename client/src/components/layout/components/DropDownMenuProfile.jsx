import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";
import React from 'react';

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DropDownMenuComponent = () => {
  const [label, setLabel] = useState("What to do?");
  useEffect(() => {
    switch (location.pathname) {
      case "/booking":
        setLabel("Booking");
        break;
      case "/points":
        setLabel("Pointa");
        break;
      default:
        setLabel("Profile");
    }
  }, [location.pathname]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{label}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Link to="/BookTrips">Booking & trip</Link></DropdownMenuItem>
        <DropdownMenuItem><Link to="/PointsandLoyality">Points & wallet</Link></DropdownMenuItem>
        <DropdownMenuItem><Link to="/booked">Booked Flights, Hotels & Transportation</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default DropDownMenuComponent


