import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  Home,
  Grid,
  ArrowLeftRight,
  Wallet,
  MoreHorizontal,
  Plane,
  Ticket,
  ShoppingBag,
  Gift,
  Music,
  Map,
  CreditCard,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import axios from "axios";
export default function PaymentTransactionPage() {
  const { toast } = useToast();
  const { prefCurrency } = useUser();
  const [walletData, setWalletData] = useState({
    wallet: 0,
    loyaltyPoints: 0,
    transactions: [],
  });

  useEffect(() => {
    // Fetch data from the API
    const fetchWalletData = async () => {
      try {
        const response = await axios.get(`/api/tourist/myTransactions?currency=${prefCurrency}`);
        console.log(response.data);
        setWalletData(response.data);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: error.message,
          status: "error",
        });
      }
    };

    fetchWalletData();
  }, [prefCurrency]);

  const renderTransactions = (transactions) => {
    return transactions.map((transaction, index) => (
      <Card key={index}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                {/* Add dynamic icons based on the transaction type */}
                {transaction.method === "card" ? (
                  <CreditCard className="h-5 w-5 text-blue-600" />
                ) : (
                  <Wallet className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.title}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleString()}
                </p>
              </div>
            </div>
            <span
              className={`${
                transaction.incoming ? "text-green-500" : "text-red-500"
              }`}
            >
              {transaction.incoming ? "+" : "-"}{prefCurrency}{transaction.amount.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Available Balance</span>
            </div>
            <CardTitle className="text-4xl font-bold">
             {prefCurrency} {walletData.wallet?.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Gift className="h-4 w-4" />
              <span className="text-sm">Loyalty Points</span>
            </div>
            <CardTitle className="text-4xl font-bold">
              {walletData.loyaltyPoints} pts
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Transactions */}
      <div className="p-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ScrollArea className="h-[500px] w-full">
              {renderTransactions(walletData.transactions)}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="income">
            <ScrollArea className="h-[500px] w-full">
              {renderTransactions(
                walletData.transactions.filter((t) => t.incoming)
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="expense">
            <ScrollArea className="h-[500px] w-full">
              {renderTransactions(
                walletData.transactions.filter((t) => !t.incoming)
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
