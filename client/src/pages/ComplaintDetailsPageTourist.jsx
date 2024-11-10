import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChatMessage from "@/components/shared/ChatMessage";
import { useParams } from "react-router-dom";
import Loading from "@/components/shared/Loading";
import axios from "axios";
import { CircleArrowLeft, ArrowBigLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ComplaintDetailsPageTourist = () => {
  const [complaint, setComplaint] = useState();
  const { id } = useParams();
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

  const fetchComplaint = () => {
    console.log("we are fetching noww");
    axios
      .get(`api/tourist/myComplaints/${id}`)
      .then((response) => {
        setComplaint(response.data);
        console.log("Just got fetchedd -> ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchComplaint(); // Initial fetch when component mounts
  }, []);

  return complaint ? (
      <Card x-chunk="dashboard-06-chunk-0" className="flex flex-col flex-1">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{`Complaints > "${complaint.title}"`}</CardTitle>
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                className="p-0 h-1"
                onClick={() => window.window.history.back()}
              >
                <CircleArrowLeft />
              </Button>
            </div>
          </div>
          <CardDescription >
            <div className="flex flex-col gap-2">
              {formatDate(complaint.date)}
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
              </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <div className="flex flex-col gap-6">
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
  ) : (
    <div className="flex justify-center items-center flex-1">
      <Loading />
    </div>
  );
};

export default ComplaintDetailsPageTourist;
