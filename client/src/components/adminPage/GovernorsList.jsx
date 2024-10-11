import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateDialog from "./shared/CreateDialog";
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
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <div className="place-self-end">
        <CreateButton className="" />
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Tourism Governors</CardTitle>
          <CardDescription>Manage your activity governors.</CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <Table>
            <TableCaption>A list of governors.</TableCaption>
            <TableHeader>
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
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{governors && governors.length}</strong> tourism
            governors
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
