import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import RateComment from "./shared/RateComment";
import RateForm from "./forms/RateForm";
export default function ActivityAttended() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/activity?currency=EGP");
        setAccounts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  const tableRows = accounts.map((account) => {
    return (
      <TableRow key={account._id}>
        <TableCell className="font-medium">{account.name}</TableCell>
        <TableCell>
          <RateComment
            form={<RateForm activityId={account._id} type="activity" />}
            type="activity"
            title={account.name}
          />
        </TableCell>
      </TableRow>
    );
  });
  return (
    <div>
      <Table>
        <TableCaption>A list of itineraries made</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>

            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>{tableRows}</TableBody>
      </Table>
    </div>
  );
}
