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
import NewActivityTagForm from "./forms/NewActivityTagForm";
import { EditTagDialog } from "./EditTag";
import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import DeleteButton from "./DeleteButton";
export default function TagTags() {
  const [tags, setTags] = useState(null);
  const { toast } = useToast();
  // Fetch tags
  const fetchTags = () => {
    axios
      .get("api/activity/tag")
      .then((response) => {
        setTags(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchTags(); // Initial fetch when component mounts
  }, []);

  const deleteClicked = (tagName) => {
    axios
      .delete(`api/activity/tag/delete/${tagName}`)
      .then((response) => {
        toast({
          title: "Tag deleted succesfully!",
        });
        fetchTags(); // Refresh the tags list after deletion
      })
      .catch((error) => {
        console.error(error);
        toast({
          text: `Failed to delete tag "${tagName}"`,
          variant: "destructive", // Error variant
        });
      });
  };

  return (
    <Table>
      <TableCaption>A list of preference tags.</TableCaption>
      <TableHeader>
        <TableCell>
          <CreateDialog
            title="Activity Tag"
            form={<NewActivityTagForm onTagCreate={fetchTags} />}
          />
        </TableCell>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead></TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags &&
          tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.name}</TableCell>
              <TableCell>
                {/* Pass the fetchTags function to EditTagDialog */}
                <EditTagDialog tag={tag.name} onTagUpdate={fetchTags} />
              </TableCell>
              <TableCell className="text-right">
                <DeleteButton
                  onConfirm={() => deleteClicked(tag.name) + fetchTags()}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
