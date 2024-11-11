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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ComplaintForm from "@/components/forms/ComplaintForm";
import CreateDialog from "@/components/shared/CreateDialog";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
export default function Complaints() {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [complaints, setComplaints] = useState([]);
  const fetchComplaints = () => {
    axios
      .get(`api/tourist/complaints/${userId}`) //get id from context here
      .then((response) => {
        setComplaints(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [onRefresh, setOnRefresh] = useState();

  useEffect(() => {
    fetchComplaints(); // Initial fetch when component mounts
  }, [onRefresh]);

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

  return (
      <Card x-chunk="dashboard-06-chunk-0 " className="flex flex-col flex-1">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Complaints</CardTitle>
            <CardDescription>Manage all complaints.</CardDescription>
          </div>
          <div className="place-self-end">
            <CreateDialog
              title="Complaint"
              form={<ComplaintForm onRefresh={setOnRefresh} issuerID={userId} />}
            />
          </div>
        </CardHeader>

        <CardContent>
          {" "}
          <Table>
            <TableCaption>A list of my complaints.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints &&
                complaints.map((complaint) => (
                  <TableRow
                    key={complaint._id}
                    onClick={() => {
                      navigate(`${complaint._id}`);
                    }}
                  >
                    <TableCell>{complaint.title}</TableCell>
                    <TableCell>{formatDate(complaint.date)}</TableCell>
                    <TableCell>
                      <Badge variant="complaint"
                        className={`place-self-start ${
                          complaint.status === "resolved"
                            ? "bg-green-500 border-green-500"
                            : "bg-orange-500 border-orange-500"
                        }`}
                      >
                        {complaint.status.toUpperCase().slice(0, 1)}
                        {complaint.status.slice(1)}
                      </Badge>
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
   );
}
