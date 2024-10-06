import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CreateDialog from "./CreateDialog";
import NewUserForm from "./forms/NewUserForm";
import axios from "axios";
import { useState, useEffect } from "react";
export default function GovernorsList() {
  const [governors, setGovernors] = useState([]);

  const fetchGovernors = () => {
    axios
      .get("api/touristGovernor/")
      .then((response) => {
        setGovernors(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchGovernors(); // Initial fetch when component mounts
  }, []);

  const CreateButton = () => {
    return (
      <CreateDialog
        title="Governor"
        form={<NewUserForm type="gov" onUserCreate={fetchGovernors} />}
      />
    );
  };

  return (
    <div>
      <CreateButton default />

      <Table>
        <TableCaption>A list of governors.</TableCaption>
        <TableHeader>
          <TableCell></TableCell>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {governors &&
            governors.map((governor) => (
              <TableRow key={governor.username}>
                <TableCell>{governor.username}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
