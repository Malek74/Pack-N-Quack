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
export default function ItinerariesMade() {
  const accounts = [
    { name: "family-friendly" },
    { name: "historical" },
    { name: "indoors" },
    { name: "Nature" },
  ];

  const tableRows = accounts.map((account) => {
    return (
      <TableRow key={account.id}>
        <TableCell className="font-medium">{account.name}</TableCell>
        <TableCell>
          <RateComment
            form={<RateForm />}
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
