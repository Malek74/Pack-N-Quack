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
import DeleteButton from "../shared/DeleteButton";
import { AlertDialog, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
export default function OrderHistory() {
  const { prefCurrency, userId } = useUser();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("present");
  const [loading, setLoading] = useState(true);
  const fetchProducts = async () => {
    setLoading(true);
    setProducts([]);
    try {
      const status = tab === "present" ? "pending" : "old";
      const response = await axios.get(
        `/api/order/viewAll?status=${status}&currency=${prefCurrency}`
      );
      setProducts(response.data); // No need to flatten; pass orders directly
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    setLoading(true);
    try {
      await axios.put(`/api/order/cancel/${id}`);
      toast({
        title: "Order cancelled",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch orders.",
        variant: "destructive",
      });
    }
  };
  const CancelButton = ({
    onConfirm,
    title = "Are you absolutely sure?",
    description = "This action cannot be undone. This will permanently delete the data forever.",
  }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button size="sm" className="h-8 gap-2" variant="destructive">
            <Trash2 className="h-4 w-4" /> Cancel Order
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  useEffect(() => {
    fetchProducts();
  }, [prefCurrency, tab]);

  const deleteClicked = () => {
    console.log("yo");
  };
  const ProductCards = ({ active }) => {
    return (
      <div className="flex flex-col gap-4">
        {loading && (
          <Loading className="place-items-center place-self-center" />
        )}
        {!loading && products.length > 0 ? (
          products.map((order) => (
            <Card key={order._id} className="p-4">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Order ID: {order._id}
                </CardTitle>
                <CardDescription>
                  <div className="text-sm">
                    Order Date:{" "}
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-sm">
                    Order Status: {order.orderStatus}
                  </div>
                  <div className="text-sm">
                    Order Total: {order.orderTotal} {prefCurrency || "USD"}
                  </div>
                  {/* <div className="text-sm">
                    Delivery Address: {order.deliveryAddress}
                  </div> */}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {order.products.length > 0 ? (
                    order.products.map((product) =>
                      product.productID ? (
                        <div
                          key={product._id}
                          className="flex flex-col items-start gap-4 md:flex-row"
                        >
                          <img
                            alt="Product image"
                            className="h-24 w-24 rounded-md object-cover"
                            src={
                              product.productID.picture.length > 0
                                ? product.productID.picture[0]
                                : "https://via.placeholder.com/150"
                            }
                          />
                          <div className="flex flex-grow flex-col">
                            <div className="text-lg font-semibold">
                              {product.productID.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {product.productID.description}
                            </div>
                            <div className="text-sm">
                              Price: {product.productID.price}{" "}
                              {prefCurrency || "USD"}
                            </div>
                            <div className="text-sm">
                              Quantity: {product.quantity}
                            </div>
                            <div className="text-sm">
                              Seller: {product.productID.sellerUsername}
                            </div>
                            {product.productID.isArchived && (
                              <div className="text-red-500">
                                (This product is archived)
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div key={product._id} className="text-red-500">
                          This product is unavailable.
                        </div>
                      )
                    )
                  ) : (
                    <div>No products in this order.</div>
                  )}
                </div>
              </CardContent>
             
                <CardFooter>
                {active && (
                  <CancelButton
                    onConfirm={() => cancelOrder(order._id) + fetchProducts()}
                  />
                )}

                </CardFooter>
            </Card>
          ))
        ) : (
          <div>No orders yet D:</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Tabs
            defaultValue="present"
            onValueChange={(value) => {
              setTab(value);
            }}
          >
            <TabsList>
              <TabsTrigger value="present">Present Orders</TabsTrigger>
              <TabsTrigger value="past">Past Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="present">
              <ProductCards active />
            </TabsContent>

            <TabsContent value="past">
              <ProductCards />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
