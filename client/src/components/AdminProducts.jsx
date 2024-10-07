// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import CreateDialog from "./CreateDialog";

import ProductForm from "./forms/ProductForm";
// import axios from "axios";
// import { useToast } from "@/hooks/use-toast";
import DeleteButton from "./DeleteButton";
import { EditProductDialog } from "./EditProduct";
// import { useState, useEffect } from "react";
// export default function Activityproduct() {
//   const { toast } = useToast();
//   const [products, setProducts] = useState(null);

//   const fetchProducts = () => {
//     axios
//       .get("api/products")
//       .then((response) => {
//         setProducts(response.data);
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   useEffect(() => {
//     fetchProducts(); // Initial fetch when component mounts
//   }, []);

//   const CreateButton = () => {
//     return (
//       <CreateDialog
//         title="Product"
//         form={<ProductForm onRefresh={fetchProducts} />}
//       />
//     );
//   };

//   return (
//     <Table>
//       <TableCaption>A list of activity products.</TableCaption>
//       <TableHeader>
//         <TableCell>
//           <CreateButton default />
//         </TableCell>
//         <TableRow>
//           <TableHead>Name</TableHead>
//           <TableHead></TableHead>
//           <TableHead className="text-right"></TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {products &&
//           products.map((product) => (
//             <TableRow key={product._id}>
//               <TableCell>{product.name}</TableCell>
//               <TableCell>
//                 <EditProductDialog
//                   product={product}
//                   onRefresh={fetchProducts}
//                 />
//               </TableCell>
//               <TableCell className="text-right">
//                 <DeleteButton
//                   onConfirm={() => deleteClicked(product._id) + fetchProducts()}
//                 />
//               </TableCell>
//             </TableRow>
//           ))}
//       </TableBody>
//     </Table>
//   );
// }
import axios from "axios";
import { ListFilter, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState, useEffect } from "react";
export const description =
  "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState(null);
  const fetchProducts = () => {
    axios
      .get("api/products")
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
        console.log(response.data[0].picture[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const deleteClicked = (id) => {
    axios
      .delete(`api/products/delete/${id}`)
      .then(() => {
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
  useEffect(() => {
    fetchProducts(); // Initial fetch when component mounts
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="archived" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <CreateDialog
                  title="Product"
                  form={
                    <ProductForm
                      onRefresh={fetchProducts}
                      adderId="670304850bf9fdbd2db01e47"
                    />
                  }
                />
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Manage your products and view their sales performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Seller</TableHead>

                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rating</TableHead>

                        <TableHead className="hidden md:table-cell"></TableHead>

                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products &&
                        products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell className="hidden sm:table-cell">
                              <img
                                alt="Product image"
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={product.picture[0]}
                                width="64"
                              />
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.status === "Active"
                                    ? "outline"
                                    : "secondary"
                                }
                              >
                                {product.sellerUsername}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell className="">
                              {product.description}
                            </TableCell>

                            <TableCell className="hidden md:table-cell">
                              {product.price}
                            </TableCell>
                            <TableCell>
                              {product.ratings.averageRating}
                            </TableCell>
                            <TableCell>
                              <EditProductDialog
                                product={product}
                                onRefresh={fetchProducts}
                              />
                            </TableCell>
                            <TableCell>
                              <DeleteButton
                                onConfirm={() =>
                                  deleteClicked(product._id) + fetchProducts()
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
                    Showing <strong>1-10</strong> of{" "}
                    <strong>{products && products.length}</strong> products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
