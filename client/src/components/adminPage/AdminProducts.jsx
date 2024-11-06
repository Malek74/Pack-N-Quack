import CreateDialog from "../shared/CreateDialog";
import ProductForm from "../forms/ProductForm";
import DeleteButton from "../shared/DeleteButton";
import { EditProductDialog } from "../editButtonsWillBeReusedLater/EditProduct";
import axios from "axios";
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
import { useUser } from "@/context/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterButtons from "../shared/FilterButtons";
import PriceSlider from "../shared/PriceSlider";
import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce"; // Import debounce from lodash

export default function AdminProducts() {
  const { prefCurrency } = useUser();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [tab, setTab] = useState("all");
  const [maxPrice, setMaxPrice] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Applied price range
  const [sliderRange, setSliderRange] = useState([0, 1000000]); // Temporary slider range
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true);
  // Create a debounced version of fetchProducts using useMemo to ensure it persists across renders
  const debouncedFetchProducts = useMemo(
    () =>
      debounce(() => {
        setLoading(true);
        const min = priceRange[0] > 0 ? priceRange[0] : 0;
        const max = priceRange[1] || maxPrice;
        console.log("fetching");
        const archiveFilter =
          tab === "all"
            ? ""
            : tab === "archived"
            ? `isArchived=true`
            : `isArchived=false`;
        axios
          .get(
            `/api/products?${archiveFilter}&minPrice=${min}&maxPrice=${max}&sortBy=ratings.averageRating&order=${selectedFilters["Sort By Rating"]}&name=${searchTerm}&currency=${prefCurrency}`
          )
          .then((response) => {
            setProducts(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
        setLoading(false);
      }, 100), // Debounce with 500ms delay

    [priceRange, searchTerm, selectedFilters, maxPrice, tab]
  );

  // Fetch the maximum product price
  const fetchMaxPrice = () => {
    axios
      .get(`api/products/maxProductPrice&currency=${prefCurrency}`)
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
  }, [searchTerm, maxPrice, priceRange, selectedFilters, tab]);

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

  const handleArchiving = (product, archive) => {
    axios
      .put(`api/products/update/${product._id}/`, {
        price: product.price,
        description: product.description,
        isArchived: archive,
      })
      .then(() => {
        toast({
          title: "Product updated succesfully!",
        });
        debouncedFetchProducts();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Product could not be updated",
          // description: error.response.data.message,
        });
        console.log(error);
      });
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
      .catch(() => {
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

  const TableContent = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Products
          </CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Available Quantity</TableHead>
                <TableHead>Sales</TableHead>
                {tab == "all" && <TableHead>Status</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && <div>Loading...</div>}
              {!loading && products.length > 0
                ? products.map((product) => (
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
                      <TableCell className="">{product.description}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.price}
                      </TableCell>
                      <TableCell>{product.ratings.averageRating}</TableCell>
                      <TableCell>{product.available_quantity}</TableCell>
                      <TableCell>
                        {product.product_sales > 0
                          ? product.product_sales
                          : "0"}
                      </TableCell>
                      {tab == "all" && (
                        <TableCell>
                          {product.isArchived ? "Archived" : "Active"}
                        </TableCell>
                      )}
                      <TableCell>
                        <EditProductDialog
                          product={product}
                          onRefresh={debouncedFetchProducts}
                        />
                        <DeleteButton
                          onConfirm={() => deleteClicked(product._id)}
                        />
                        {tab === "all" && product.isArchived && (
                          <Button
                            onClick={() => handleArchiving(product, false)}
                          >
                            Unarchive
                          </Button>
                        )}
                        {tab === "all" && !product.isArchived && (
                          <Button
                            onClick={() => handleArchiving(product, true)}
                          >
                            Archive
                          </Button>
                        )}

                        {tab === "archived" && (
                          <Button
                            onClick={() => handleArchiving(product, false)}
                          >
                            Unarchive
                          </Button>
                        )}
                        {tab === "active" && (
                          <Button
                            onClick={() => handleArchiving(product, true)}
                          >
                            Archive
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                : !loading && (
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
    );
  };
  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Tabs
            defaultValue="all"
            onValueChange={(value) =>
              setTab(value) + setProducts([]) + console.log(value)
            }
          >
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
                <FilterButtons
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
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TableContent />
            </TabsContent>
            <TabsContent value="active">
              <TableContent />
            </TabsContent>
            <TabsContent value="archived">
              <TableContent />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
