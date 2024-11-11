import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RateComment from "../shared/RateComment";
import { useUser } from "@/context/UserContext";
import { Rating } from "../shared/Rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import RateForm from "../forms/RateForm";
import Loading from "../shared/Loading";
export default function OrderHistory() {
  const { prefCurrency, userId } = useUser();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/products/myProducts/${userId}?currency=${prefCurrency}`
      );
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts or dependencies change
  }, [prefCurrency, userId]);
  const ProductCards = () => {
    return (
      <div className="flex flex-col gap-4">
        {loading && (
          <Loading className="place-self-center place-items-center" />
        )}
        {!loading && products.length > 0 ? (
          products.map(({ productId }) => (
            <Card
              key={productId._id}
              className="flex flex-col md:flex-row p-4 items-start"
            >
              {/* Handle multiple images */}
              <img
                alt="Product image"
                className="w-full md:w-48 rounded-md object-cover mb-4 md:mb-0 md:mr-4"
                src={
                  productId.picture.length > 0
                    ? productId.picture[0]
                    : "https://via.placeholder.com/150"
                }
              />
              <div className="flex flex-col flex-grow">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg font-semibold">
                    {productId.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    <div className="mb-2">
                      <Rating
                        rating={productId.ratings.averageRating}
                        numberOfReviews={productId.ratings.reviews.length}
                      />
                    </div>
                    {productId.description}
                    {productId.isArchived && (
                      <div className="text-red-500 mt-2">
                        (This product is archived)
                      </div>
                    )}

                    <div className="flex flex-col mt-2 gap-2">
                      <div className="text-primary text-lg font-bold">
                        {productId.price} {prefCurrency || "USD"}
                      </div>
                      <div className="flex flex-row justify-between">
                        <Badge variant="outline">
                          {productId.sellerUsername}
                        </Badge>
                        <RateComment
                          form={
                            <RateForm
                              type="products"
                              userId={userId}
                              productId={productId._id}
                              onRefresh={fetchProducts}
                            />
                          }
                          title={productId.name}
                        />
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
              </div>
            </Card>
          ))
        ) : (
          <div>No purchases yet D:</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Tabs
            defaultValue="all"
            onValueChange={(value) => {
              setTab(value);
              fetchProducts(); // Fetch products when the tab changes
            }}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ProductCards />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
