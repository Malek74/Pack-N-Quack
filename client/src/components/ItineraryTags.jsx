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
import NewItineraryTagForm from "./forms/NewItineraryTagForm";
import { EditItineraryTag } from "./EditItineraryTag";
import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import DeleteButton from "./DeleteButton";
export default function ItineraryTags() {
  const [tags, setTags] = useState(null);
  const { toast } = useToast();
  // Fetch tags
  const fetchTags = () => {
    axios
      .get("api/itiernaryTags")
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
      .delete(`api/itiernaryTags/${tagName}`)
      .then((response) => {
        console.log(response);
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
            title="Itinerary Tag"
            form={<NewItineraryTagForm onTagCreate={fetchTags} />}
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
            <TableRow key={tag.tag}>
              <TableCell>{tag.tag}</TableCell>
              <TableCell>
                {/* Pass the fetchTags function to EditTagDialog */}
                <EditItineraryTag tag={tag.tag} onTagUpdate={fetchTags} />
              </TableCell>
              <TableCell className="text-right">
                <DeleteButton
                  onConfirm={() => deleteClicked(tag.tag) + fetchTags()}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
