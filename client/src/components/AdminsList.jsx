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

import CreateDialog from "./CreateDialog";
import NewUserForm from "./forms/NewUserForm";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { DialogClose } from "./ui/dialog";
import { useState, useEffect } from "react";
export default function AdminsList() {
  const { toast } = useToast();
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
    <div>
      <Table>
        <TableCaption>A list of admins.</TableCaption>
        <TableHeader>
          <TableCell>
            <CreateButton />
          </TableCell>
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
    </div>
  );
}
