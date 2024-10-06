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
import CreateDialog from "./CreateDialog";
import NewCategoryForm from "./forms/NewCategoryForm";
import { EditCategoryDialog } from "./EditCategory";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import DeleteButton from "./DeleteButton";
import { useState, useEffect } from "react";
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
    return <CreateDialog title="Category" form={<NewCategoryForm />} />;
  };

  return (
    <Table>
      <TableCaption>A list of activity categories.</TableCaption>
      <TableHeader>
        <TableCell>
          <CreateButton default />
        </TableCell>
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
                <EditCategoryDialog category={category.name} />
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
  );
}
