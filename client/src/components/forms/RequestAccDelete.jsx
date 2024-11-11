/* eslint-disable react/prop-types */
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
export default function RequestAccDelete({
onRefresh, userId, userType

}) {


  const { toast } = useToast();
  const handleConfirm = () => {
    onSubmit();
    toast({
      title: "Delete request sent successfully",
      description: "Your account deletion request has been submitted.",
    });
    
    
  };

  function onSubmit() {
  axios
    .post(`api/booking/delete`, {
      userId: userId,  
      userType:userType 
    })
    .then(() => {
      console.log("Delete request sent successfully");
    })
    .catch((error) => {
      console.error("Error sending delete request:", error);
    });
}


  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button size="sm" className="h-8 gap-2" variant="destructive"  > 
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete the data forever.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
