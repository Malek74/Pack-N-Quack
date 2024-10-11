import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CreateDialog from "../shared/CreateDialog";
import NewUserForm from "../forms/NewUserForm";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
export default function AdminsList() {
  const [admins, setAdmins] = useState(null);

  const fetchAdmins = () => {
    axios
      .get("api/admins")
      .then((response) => {
        setAdmins(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchAdmins(); // Initial fetch when component mounts
  }, []);

  const CreateButton = () => {
    return (
      <CreateDialog
        title="Admin"
        form={<NewUserForm type="admin" onUserCreate={fetchAdmins} />}
      />
    );
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <div className="place-self-end">
        <CreateButton className="" />
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Admins</CardTitle>
          <CardDescription>Manage your admins.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of admins.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins &&
                admins.map((admin) => (
                  <TableRow key={admin.username}>
                    <TableCell>{admin.username}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{admins && admins.length}</strong> admins
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
