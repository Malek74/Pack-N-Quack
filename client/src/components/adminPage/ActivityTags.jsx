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
import { Button } from "../ui/button";
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
import CreateDialog from "../shared/CreateDialog";
import NewActivityTagForm from "../forms/NewActivityTagForm";
import { EditTagDialog } from "../editButtonsWillBeReusedLater/EditActivityTag";
import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import DeleteButton from "../shared/DeleteButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function ActivityTags() {
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
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <div className="place-self-end">
        <CreateDialog
          title="Activity Tag"
          form={<NewActivityTagForm onTagCreate={fetchTags} />}
        />
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Activity Tags</CardTitle>
          <CardDescription>Manage your activity tags.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of preference tags.</TableCaption>
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
                  <TableRow key={tag.name}>
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
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{tags && tags.length}</strong> activity tags
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
