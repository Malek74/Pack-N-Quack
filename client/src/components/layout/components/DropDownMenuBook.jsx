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

const DropDownMenuComponent = () => {
  const [label, setLabel] = useState("What to do?")
  useEffect(() => {
    switch (location.pathname) {
      case '/bookingFlight':
        setLabel('Book a Flight');
        break;
      case '/bookingHotel':
        setLabel('Book a Hotel');
        break;
      default:
        setLabel('Booking');
    }
  }, [location.pathname]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{label}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Book</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Link to="/bookingFlight">Flight</Link></DropdownMenuItem>
        <DropdownMenuItem><Link to="/bookingHotel">Hotel</Link></DropdownMenuItem>
        <DropdownMenuItem><Link to="/transportations">Transportation</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default DropDownMenuComponent


