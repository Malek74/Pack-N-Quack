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
  import { useToast } from "@/hooks/use-toast";
  import DeleteButton from "../shared/DeleteButton";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import PendingAndResolved from "../itinerariesPage/PendingAndResolved";
import { Button } from "@mui/material";
  export default function Complaints({openComplaint}) {
    const { toast } = useToast();
    const [complaints, setComplaints] = useState([]);
    const fetchComplaints = () => {
      axios
        .get("api/admins/complaints")
        .then((response) => {
          setComplaints(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

   
  
    useEffect(() => {
      fetchComplaints(); // Initial fetch when component mounts
    }, []);

    // const openComplaint = (complaint) => {
    //   //link to the complaint with the values int the complaint map
    //   setCurrentComplaint(complaint);
    //   console.log("Opened complaint -> ", complaint);
    //   console.log("currentComplaint -> ",currentComplaint)
    //   setActiveSection("Single Complaint");
      
    // }

    const dummyComplaints = [
      {
        _id: "1",
        title: "Delayed Response",
        body: "The response time was very slow.",
        date: "2024-10-01",
        status: "pending",
        replies: [
          "We're looking into the issue and will get back to you soon.",
          "Thank you for your patience.",
          "We have escalated the issue to our team."
        ],
        _issuerID: "user123",
      },
      {
        _id: "2",
        title: "Incorrect Billing",
        body: "I was overcharged for my subscription.",
        date: "2024-10-05",
        status: "resolved",
        replies: [
          "The billing issue has been resolved. Sorry for the inconvenience."
        ],
        _issuerID: "user456",
      },
      {
        _id: "3",
        title: "Service Outage",
        body: "The service was down for over 2 hours.",
        date: "2024-10-10",
        status: "pending",
        replies: [
          "We are investigating the cause of the outage and will update you shortly.",
          "Our team is working on restoring the service.",
          "We apologize for the downtime and will ensure it doesn't happen again."
        ],
        _issuerID: "user789",
      },
      {
        _id: "4",
        title: "Unhelpful Support",
        body: "The support team did not resolve my issue.",
        date: "2024-10-12",
        status: "resolved",
        replies: [
          "We apologize for the lack of support. We are reviewing your case.",
          "A senior support agent will contact you shortly.",
          "Thank you for your feedback, we will improve our support."
        ],
        _issuerID: "user101",
      },
      {
        _id: "5",
        title: "Account Suspension",
        body: "My account was suspended without notice.",
        date: "2024-10-15",
        status: "pending",
        replies: [
          "Your account suspension is under review. Please expect an update soon.",
          "We are working to resolve this as quickly as possible."
        ],
        _issuerID: "user202",
      },
    ];
    
    
  
  
    return (
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Complaints</CardTitle>
            <CardDescription>Manage all complaints.</CardDescription>
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
                {dummyComplaints &&
                  dummyComplaints.map((complaint) => (
                    <TableRow key={complaint._id}  onClick={() => openComplaint(complaint)}>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>{complaint.date}</TableCell>
                      <TableCell><PendingAndResolved status={complaint.status} id = {complaint._id}/></TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{complaints && complaints.length}</strong> complaints
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
  