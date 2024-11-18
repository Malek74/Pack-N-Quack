import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PendingAndResolved from "../shared/PendingAndResolved";
import FilterButtons from "../shared/FilterButtons";
export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const navigate = useNavigate();
  const fetchComplaints = () => {
    console.log(
      "fetching w/ query ",
      `api/admins/complaints?sortBy=${selectedFilters["Sort By Date"]}&statusFilter=${selectedFilters["Status"]}`
    );
    axios
      .get(
        `api/admins/complaints?sortBy=${selectedFilters["Sort By Date"]}&statusFilter=${selectedFilters["Status"]}`
      )
      .then((response) => {
        setComplaints(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    // Format the date
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format the time
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate}, ${formattedTime}`;
  }

  useEffect(() => {
    fetchComplaints();
  }, [selectedFilters]);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value, // Update the selected value based on the type
    }));
    console.log(type, value);
  };

  let buttons = [
    {
      type: "Sort By Date", // This will create a "Sort By" dropdown
      options: [
        { label: "Acscending", value: "asc" },
        { label: "Descending", value: "desc" },
      ],
    },
    {
      type: "Status", // This will create a "Sort By" dropdown
      options: [
        { label: "Pending", value: "pending" },
        { label: "Resolved", value: "resolved" },
      ],
    },
  ];

  const openComplaint = (complaint) => {
    const complaintID = complaint._id;
    navigate(`${complaintID}`);
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
          <CardDescription>Manage all complaints.</CardDescription>
          <FilterButtons
            buttons={buttons}
            onFilterChange={handleFilterChange}
          />
        </CardHeader>
        <CardContent>
          {" "}
          <Table>
            <TableCaption>A list of complaints.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints?.map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell onClick={() => openComplaint(complaint)}>
                    {complaint.title}
                  </TableCell>
                  <TableCell onClick={() => openComplaint(complaint)}>
                    {formatDate(complaint.date)}
                  </TableCell>
                  <TableCell>
                    <PendingAndResolved
                      status={complaint.status}
                      id={complaint._id}
                      onRefresh={fetchComplaints}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{complaints && complaints.length}</strong>{" "}
            complaints
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
