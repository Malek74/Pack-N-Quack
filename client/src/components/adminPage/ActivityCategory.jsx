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
import CreateDialog from "../shared/CreateDialog";
import NewCategoryForm from "../forms/NewCategoryForm";
import { EditCategoryDialog } from "../editButtonsWillBeReusedLater/EditCategory";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import DeleteButton from "../shared/DeleteButton";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function ActivityCategory() {
  const { toast } = useToast();
  const [categories, setCategories] = useState(null);

  const deleteClicked = (categoryName) => {
    axios
      .delete(`api/activity/category/delete/${categoryName}`)
      .then((response) => {
        toast({
          title: "Category deleted succesfully!",
        });
        fetchCategories(); // Refresh the categorys list after deletion
      })
      .catch((error) => {
        console.error(error);
        toast({
          text: `Failed to delete category "${categoryName}"`,
          variant: "destructive", // Error variant
        });
      });
  };

  const fetchCategories = () => {
    axios
      .get("api/activity/category")
      .then((response) => {
        setCategories(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchCategories(); // Initial fetch when component mounts
  }, []);

  const CreateButton = () => {
    return (
      <CreateDialog
        title="Category"
        form={<NewCategoryForm onRefresh={fetchCategories} />}
      />
    );
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <div className="place-self-end">
        <CreateButton className="" />
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your activity categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of activity categories.</TableCaption>
            <TableHeader>
              <TableCell></TableCell>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead></TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories &&
                categories.map((category) => (
                  <TableRow key={category.name}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <EditCategoryDialog
                        category={category.name}
                        onRefresh={fetchCategories}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteButton
                        onConfirm={() =>
                          deleteClicked(category.name) + fetchCategories()
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{categories && categories.length}</strong>{" "}
            categories
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
