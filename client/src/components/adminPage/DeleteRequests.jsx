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
export default function DeleteRequests() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState();
  const fetchAccounts = () => {
    axios
      .get("api/admin/deleteRequests")
      .then((response) => {
        setAccounts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteClicked = (account) => {
    console.log("Hi " + account.userType);
    axios
      .delete(`api/admins/${account._id}`, {
        data: {
          userType: account.userType,
        },
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
          text: `Failed to delete account"`,
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
          <CardTitle>Accounts</CardTitle>
          <CardDescription>Manage all accounts.</CardDescription>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts &&
                accounts.map((account) => (
                  <TableRow key={account._id}>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.userType}</TableCell>
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
