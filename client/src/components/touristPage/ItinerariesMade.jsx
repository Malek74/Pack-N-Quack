import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import RateComment from "../shared/RateComment";
import RateForm from "../forms/RateForm";
import { useEffect, useState } from "react";
import axios from "axios";
export default function ItinerariesMade() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          "/api/tourist/myitineraries/6725442e98359339d8b821f0"
        );
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
            form={
              <RateForm
                itineraryId={account._id}
                type="itineraries"
                showExperience
              />
            }
            type="itineraries"
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
