import React, { useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

import ChatMessage from '@/components/shared/ChatMessage';





const ComplaintDetailsPageTourist = ({complaint}) => {
    console.log("Complaintttt",complaint);
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>{`Complaints > "${complaint.title}"`}</CardTitle>
        <CardDescription>{complaint.date}</CardDescription>
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
                {complaint.replies && 
                complaint.replies.map((reply) => (
                    <ChatMessage message={reply} direction={"right"} />
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
  </div>
  )
}

export default ComplaintDetailsPageTourist  