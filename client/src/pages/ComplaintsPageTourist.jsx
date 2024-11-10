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

 

  export default function Complaints() {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const fetchComplaints = () => {
      axios
        .get("api/tourist/complaints/6702cde57d7e2444d9713d8d") //get id from context here
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
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
      // Format the time
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    
      return `${formattedDate}, ${formattedTime}`;
    }

    
  
    return (
      <div className="flex flex-col sm:gap-4 sm:py-4 px-[5.4rem]">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Complaints</CardTitle>
            <CardDescription>Manage all complaints.</CardDescription>
            <CreateDialog
          title="Complaint"
          form={<ComplaintForm onRefresh = {setOnRefresh}/>}
        />
            
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
                    <TableRow key={complaint._id}  onClick={() => {navigate(`/complaintDetails/${complaint._id}`)}}>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>{formatDate(complaint.date)}</TableCell>
                      <TableCell  className={`${complaint.status === "resolved" ? "text-green-500 border-green-500" : "text-orange-500 border-orange-500"}`}>{complaint.status}</TableCell>
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
  