import CreateDialog from "../shared/CreateDialog";
import ProductForm from "../forms/ProductForm";
import DeleteButton from "../shared/DeleteButton";
import { EditProductDialog } from "../editButtonsWillBeReusedLater/EditProduct";
import axios from "axios";
import { ListFilter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterButton from "@/components/shared/FilterButtons";
import PriceSlider from "@/components/shared/PriceSlider";
import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce"; // Import debounce from lodash

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Applied price range
  const [sliderRange, setSliderRange] = useState([0, 1000000]); // Temporary slider range
  const [selectedFilters, setSelectedFilters] = useState({});

  // Create a debounced version of fetchProducts using useMemo to ensure it persists across renders
  const debouncedFetchProducts = useMemo(
    () =>
      debounce(() => {
        const min = priceRange[0] > 0 ? priceRange[0] : 0;
        const max = priceRange[1] || maxPrice;

        axios
          .get(
            `/api/products?minPrice=${min}&maxPrice=${max}&sortBy=ratings.averageRating&order=${selectedFilters["Sort By Rating"]}&name=${searchTerm}`
          )
          .then((response) => {
            setProducts(response.data);
            console.log(priceRange + response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, 100), // Debounce with 500ms delay
    [priceRange, searchTerm, selectedFilters, maxPrice]
  );

  // Fetch the maximum product price
  const fetchMaxPrice = () => {
    axios
      .get(`api/products/maxProductPrice`)
      .then((response) => {
        setMaxPrice(response.data.maxPrice + 200);
        setSliderRange([0, response.data.maxPrice]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Re-fetch products when filters or search terms change
  useEffect(() => {
    if (maxPrice !== null) {
      debouncedFetchProducts(); // Use the debounced function
    }
  }, [searchTerm, maxPrice, priceRange, selectedFilters]);

  // Fetch maxPrice when component mounts
  useEffect(() => {
    fetchMaxPrice();
  }, []);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value, // Update the selected value based on the type
    }));
  };

  // Handle slider change
  const handlePriceChange = (newRange) => {
    setSliderRange(newRange); // Temporarily update the slider range
  };

  // Apply the slider range to the actual price range on clicking "Apply"
  const applyPriceRange = () => {
    setPriceRange(sliderRange);
  };

  const deleteClicked = (id) => {
    axios
      .delete(`api/products/delete/${id}`)
      .then(() => {
        toast({
          title: "Product deleted successfully!",
        });
        debouncedFetchProducts(); // Refresh the products list after deletion
      })
      .catch((error) => {
        toast({
          text: "Failed to delete product",
          variant: "destructive", // Error variant
        });
      });
  };

  let filterButtons = [
    {
      type: "Sort By Rating",
      options: [
        { label: "Ratings Low To High", value: "asc" },
        { label: "Ratings High To Low", value: "desc" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-center">
              <div className="flex justify-center gap-4 mb-4 items-center">
                <div className="rounded-lg flex justify-center items-center">
                  <Input
                    placeholder="Search for product.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Handle changes in search term
                    className="p-2 rounded-md w-full border"
                  />
                  <Button
                    size="sm"
                    className="bg-gold hover:bg-goldhover flex gap-2 text-white px-6 py-3 rounded-md ml-4"
                  >
                    <Search />
                    <p>Search</p>
                  </Button>
                </div>
                {/* Filter Buttons */}
                <FilterButton
                  className="mb-0"
                  buttons={filterButtons}
                  onFilterChange={handleFilterChange}
                />

                {maxPrice !== null && (
                  <>
                    <PriceSlider
                      min={0}
                      max={maxPrice}
                      priceRange={sliderRange} // Pass the temporary slider range
                      handlePriceChange={handlePriceChange} // Update slider range on change
                    />
                    <Button
                      size="sm"
                      onClick={applyPriceRange} // Apply the price range on click
                    >
                      Apply
                    </Button>
                  </>
                )}
              </div>
              <div className="ml-auto flex items-center gap-2">
                {/* Create Product Button */}
                <CreateDialog
                  title="Product"
                  form={
                    <ProductForm
                      onRefresh={debouncedFetchProducts}
                      adderId="670304850bf9fdbd2db01e47"
                    />
                  }
                />
              </div>
            </div>

            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived" className="hidden sm:flex">
                Archived
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
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
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {products.length > 0 ? (
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
                              <Badge variant="outline">
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
                                onRefresh={debouncedFetchProducts}
                              />
                            </TableCell>
                            <TableCell>
                              <DeleteButton
                                onConfirm={() => deleteClicked(product._id)}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan="7">No products found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>

                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-{products.length}</strong> of{" "}
                    <strong>{products.length}</strong> products
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
