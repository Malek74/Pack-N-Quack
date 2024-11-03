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
  export default function Complaints() {
    const { toast } = useToast();
    const [complaints, setComplaints] = useState();
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
                {complaints &&
                  complaints.map((complaint) => (
                    <TableRow key={complaint._id}>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>{complaint.date}</TableCell>
                      <TableCell>{complaint.status}</TableCell>
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
  