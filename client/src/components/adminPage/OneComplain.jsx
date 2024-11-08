import React, { useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Button } from '../ui/button';
import ChatMessage from '../shared/ChatMessage';
import MessageInput from '../shared/MessageInput';
import axios from 'axios';




const OneComplain = ({complaint, onRefresh}) => {
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

    const onSubmitReply = (reply) =>{
      console.log("rep?", reply)
      axios
      .put(`/api/complaints/reply/${complaint._id}`,reply)
      .then((response) => {
        console.log("msggggg ", response.data)
        onRefresh();
      })
      .catch((error) => {
        console.error("There was an error changing the status:", error); 
      });
    };
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>{`Complaints > "${complaint.title}"`}</CardTitle>
        <CardDescription>{formatDate(complaint.date)}</CardDescription>
      </CardHeader>
      <CardContent>
        {" "}
        <div className='flex flex-col gap-6'>
            {/* <div className = 'flex flex-row justify-between'>
                <h1 className='text-3xl font-semibold'>{complaint.title}</h1>
                <h3>{complaint.date}</h3>
            </div> */}
            <div className="flex flex-col">
                {/* <p>{complaint.body}</p> */}
                <ChatMessage message={complaint.body} direction={"left"} />
                {complaint.reply && 
                complaint.reply.map((reply) => (
                    <ChatMessage message={reply} direction={"right"} />
                ))}
                
            </div>
            {/* onClick will popOut a dialog/form to write or maybe feedback like chat */}
            <MessageInput onSubmit={onSubmitReply}/>
        </div>
        
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{1}</strong> complaint
        </div>
      </CardFooter>
    </Card>
  </div>
  )
}

export default OneComplain