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
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreateDialog from "./CreateDialog";
import NewPreferenceForm from "./forms/NewPreferenceTag";
import { EditTagDialog } from "./EditTag";
export default function tagTags() {
  const deleteClicked = (id) => {
    console.log(id);
  };
  const tagTags = [
    { id: 1, name: "historic areas" },
    { id: 2, name: "beaches" },
    { id: 3, name: "family-friendly" },
    { id: 4, name: "shopping" },
  ];

  return (
    <Table>
      <TableCaption>A list of preference tags.</TableCaption>
      <TableHeader>
        <TableCell>
          <CreateDialog title="Preference Tag" form={<NewPreferenceForm />} />
        </TableCell>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead></TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tagTags.map((tag) => (
          <TableRow key={tag.id}>
            <TableCell className="font-medium">{tag.id}</TableCell>
            <TableCell>{tag.name}</TableCell>
            <TableCell>
                <EditTagDialog tag={tag.name} />
            </TableCell>
            <TableCell className="text-right">
              <Button
                onClick={() => deleteClicked(account.id)}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
