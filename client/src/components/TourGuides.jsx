import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import RateComment from "./shared/RateComment";
import RateForm from "./forms/RateForm";
export default function TourGuides() {
  const accounts = [
    { id: 1, username: "mariam" },
    { id: 2, username: "ramito" },
    { id: 3, username: "manjp" },
    { id: 4, username: "miro" },
  ];

  const tableRows = accounts.map((account) => {
    return (
      <TableRow key={account.id}>
        <TableCell className="font-medium">{account.id}</TableCell>
        <TableCell>{account.username}</TableCell>
        <TableCell>
          <RateComment
            form={<RateForm />}
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
