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
import { format } from "date-fns";
export default function DeleteRequests() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState();
  const fetchAccounts = () => {
    axios
      .get("/api/admins/deleteRequests")
      .then((response) => {
        setAccounts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteClicked = (account) => {
    axios
      .post(`/api/admins/confirmDelete`, {
        ...account,
      })
      .then(() => {
        toast({
          title: "Account deleted succesfully!",
        });
        fetchAccounts(); // Refresh the tags list after deletion
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: error.response.data.message,
          description: error.response.data.error,
          variant: "destructive", // Error variant
        });
      });
  };

  useEffect(() => {
    fetchAccounts(); // Initial fetch when component mounts
  }, []);

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Deletion Account Requests</CardTitle>
          <CardDescription>
            Manage all account deletion requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <Table>
            <TableCaption>A list of accounts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts &&
                accounts.map((account) => (
                  <TableRow key={account._id}>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.userType}</TableCell>
                    <TableCell>{account.status}</TableCell>
                    <TableCell>{format(account.date, "PP")}</TableCell>
                    <TableCell>
                      <DeleteButton onConfirm={() => deleteClicked(account)} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{accounts && accounts.length}</strong> accounts
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
