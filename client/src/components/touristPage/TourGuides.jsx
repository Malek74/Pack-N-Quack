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
export default function TourGuides() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/tourGuide");
        setAccounts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  const tableRows = accounts.map((account) => {
    return (
      <TableRow key={account.id}>
        <TableCell className="font-medium">{account._id}</TableCell>
        <TableCell>{account.username}</TableCell>
        <TableCell>
          <RateComment
            form={
              <RateForm
                tourGuideId={account._id}
                type="tourguide"
                showExperience
              />
            }
            type="tourguide"
            title={account.username}
          />
        </TableCell>
      </TableRow>
    );
  });
  return (
    <div>
      <Table>
        <TableCaption>A list of tour guides</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Username</TableHead>

            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>{tableRows}</TableBody>
      </Table>
    </div>
  );
}
