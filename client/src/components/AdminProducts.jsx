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
import ProductForm from "./forms/ProductForm";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import DeleteButton from "./DeleteButton";
import { EditProductDialog } from "./EditProduct";
import { useState, useEffect } from "react";
export default function Activityproduct() {
  const { toast } = useToast();
  const [products, setProducts] = useState(null);

  const deleteClicked = (id) => {
    axios
      .delete(`api/products/delete/${id}`)
      .then((response) => {
        toast({
          title: "Product deleted succesfully!",
        });
        fetchProducts(); // Refresh the products list after deletion
      })
      .catch((error) => {
        console.error(error);
        toast({
          text: "Failed to delete product",
          variant: "destructive", // Error variant
        });
      });
  };

  const fetchProducts = () => {
    axios
      .get("api/products")
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchProducts(); // Initial fetch when component mounts
  }, []);

  const CreateButton = () => {
    return (
      <CreateDialog
        title="Product"
        form={<ProductForm onRefresh={fetchProducts} />}
      />
    );
  };

  return (
    <Table>
      <TableCaption>A list of activity products.</TableCaption>
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
        {products &&
          products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <EditProductDialog
                  product={product}
                  onRefresh={fetchProducts}
                />
              </TableCell>
              <TableCell className="text-right">
                <DeleteButton
                  onConfirm={() => deleteClicked(product._id) + fetchProducts()}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
