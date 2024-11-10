import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

import ChatMessage from '@/components/shared/ChatMessage';
import { useParams } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import axios from 'axios';




const ComplaintDetailsPageTourist = () => {
    const [complaint, setComplaint] = useState();
    const { id } = useParams();
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

    const fetchComplaint= () => {
      console.log("we are fetching noww");
      axios
        .get(`api/tourist/myComplaints/${id}`)
        .then((response) => {
          setComplaint(response.data);
          console.log("Just got fetchedd -> ",response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    useEffect(() => {
      fetchComplaint(); // Initial fetch when component mounts
    }, []);

  return (complaint? <div className="flex flex-col sm:gap-4 sm:py-4 px-[5.4rem]">
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <div className='flex justify-between'>
          <CardTitle>{`Complaints > "${complaint.title}"`}</CardTitle>
          <p  className={`${complaint.status === "resolved" ? "text-green-500 border-green-500" : "text-orange-500 border-orange-500"}`}>{complaint.status}</p>
        </div>
        <CardDescription>{formatDate(complaint.date)}</CardDescription>
      </CardHeader>
      <CardContent>
        {" "}
        <div className='flex flex-col gap-6'>
            <div className="flex flex-col">
                <ChatMessage message={complaint.body} direction={"right"} />
                {complaint.reply && 
                complaint.reply.map((reply) => (
                    <ChatMessage message={reply} direction={"left"} />
                ))} 
            </div>
        </div>
        
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{1}</strong> complaint
        </div>
      </CardFooter>
    </Card>
  </div> : <div className = "flex justify-center items-center flex-1"><Loading /></div>
  )
}

export default ComplaintDetailsPageTourist  