import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChatMessage from "../shared/ChatMessage";
import MessageInput from "../shared/MessageInput";
import axios from "axios";
import Loading from "../shared/Loading";
import PendingAndResolved from "../shared/PendingAndResolved";
import { useParams } from "react-router-dom";

const OneComplain = () => {
  const { complaintID } = useParams();
  console.log(complaintID)
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

  const [onNewReply, setOnNewReply] = useState();

  const onSubmitReply = (reply) => {
    console.log("rep?", reply);
    axios
      .put(`/api/complaints/reply/${complaintID}`, { reply: reply })
      .then((response) => {
        console.log("msggggg ", response.data);
        // setComplaint(response.data);
        setOnNewReply(response.data);
        // onRefresh();
      })
      .catch((error) => {
        console.error("There was an error changing the status:", error);
      });
  };

  const [complaint, setComplaint] = useState();

  const fetchComplaint = () => {
    axios
      .get(`api/admins/complaints/${complaintID}`)
      .then((response) => {
        setComplaint(response.data);
        console.log("complaint fetched ---> ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchComplaint(); // Initial fetch when component mounts
  }, [onNewReply, complaintID]);

  return complaint ? (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{`Complaints > "${complaint.title}"`}</CardTitle>
            <PendingAndResolved
              status={complaint.status}
              id={complaint._id}
              setStatusRefresh={setStatusRefresh}
            />
          </div>
          <CardDescription>{formatDate(complaint.date)}</CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <ChatMessage message={complaint.body} direction={"left"} />

              {complaint.reply &&
                complaint.reply.map((reply) => (
                  <ChatMessage message={reply} direction={"right"} />
                ))}
            </div>
            {/* onClick will popOut a dialog/form to write or maybe feedback like chat */}
            <MessageInput onSubmit={onSubmitReply} />
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{1}</strong> complaint
          </div>
        </CardFooter>
      </Card>
    </div>
  ) : (
    <div className="flex justify-center items-center flex-1">
      <Loading />
    </div>
  );
};

export default OneComplain;
