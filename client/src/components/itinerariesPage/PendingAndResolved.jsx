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

  import axios from "axios";
  
  const PendingAndResolved = ({status, id}) => {

    const changeStatus = async (id) => {
        
        let newStatus = status === "resolved" ? "pending" : "resolved";
        console.log("stat changed to ", newStatus);
        axios
        .put(`/api/admin/complaints/${id}`, newStatus)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("There was an error changing the status:", error); 
        });
      };

    return (
      <DropdownMenu>
   <DropdownMenuTrigger 
  className={`px-2 py-1 border rounded-lg ${status === "resolved" ? "text-green-500 border-green-500" : "text-orange-500 border-orange-500"}`}
>
  {status}
</DropdownMenuTrigger>

    <DropdownMenuContent>
      <DropdownMenuItem  onClick={() => changeStatus(id)} className = {`${status === "pending" ? "text-green-500" : "text-orange-500"}`}>{status === "resolved" ? "pending" : "resolved"}</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  
    )
  }
  
  export default PendingAndResolved
  
  
  