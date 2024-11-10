import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const PendingAndResolved = ({ status, id, onRefresh }) => {
  const { toast } = useToast();
  const changeStatus = async (id) => {
    let newStatus = status === "resolved" ? "pending" : "resolved";
    console.log("stat changed to ", newStatus);
    axios
      .put(`/api/admins/complaints/${newStatus}/${id}`)
      .then(() => {
        toast({
          title: `Status changed succesfully`,
          variant: "success"
        });
        onRefresh();
      })
      .catch((error) => {
        console.error("There was an error changing the status:", error);
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`px-2 py-1 flex items-center border rounded-lg ${
          status === "resolved"
            ? "text-green-500 border-green-500"
            : "text-orange-500 border-orange-500"
        }`}
      >
        {status.toUpperCase().slice(0, 1) + status.toLowerCase().slice(1)}
        <svg // Small arrow icon
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1 h-4 w-4 text-gray-500 transition-transform duration-200"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => changeStatus(id)}
          className={`${
            status === "pending" ? "text-green-500" : "text-orange-500"
          }`}
        >
          {status === "resolved" ? "Pending" : "Resolved"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PendingAndResolved;
