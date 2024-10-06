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
import DeleteButton from "./DeleteButton";
export default function AccountDashboard() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState();
  const fetchAccounts = () => {
    axios
      .get("api/admins/users")
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
    <div>
      <Table>
        <TableCaption>A list of accounts.</TableCaption>
        <TableHeader>
          <TableCell></TableCell>
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
    </div>
  );
}
