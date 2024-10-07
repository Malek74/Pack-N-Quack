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
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <div className="place-self-end">
        <CreateDialog
          title="Itinerary Tag"
          form={<NewItineraryTagForm onTagCreate={fetchTags} />}
        />
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Itinerary Tags</CardTitle>
          <CardDescription>Manage your itinerary tags.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of itinerary tags.</TableCaption>
            <TableHeader>
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
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{tags && tags.length}</strong> products
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
