import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,  
  Wallet,
  Gift,
  CreditCard,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

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
        const response = await fetch("/api/tourist/myTransactions");
        const data = await response.json();
        setWalletData(data);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: error.message,
          status: "error",
        });
      }
    };

    fetchWalletData();
  }, [toast]);

  const renderTransactions = (transactions) => {
    return transactions.map((transaction, index) => (
      <Card key={index}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
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
              {transaction.incoming ? "+" : "-"}${transaction.amount.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Pack&Quack Wallet</h1>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
        </Avatar>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Available Balance</span>
            </div>
            <CardTitle className="text-4xl font-bold">
             {prefCurrency} {walletData.wallet.toFixed(2)}
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
