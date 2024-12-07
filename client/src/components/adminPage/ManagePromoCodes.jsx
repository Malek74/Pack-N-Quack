import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteButton from "../shared/DeleteButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManagePromoCodes() {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [amount, setAmount] = useState("");
  const [promoCodesList, setPromoCodesList] = useState([]); // To store fetched promo codes
  const [isLoading, setIsLoading] = useState(false);
  const [promoCodeError, setPromoCodeError] = useState("");
  const [amountError, setAmountError] = useState("");

  // Fetch promo codes from the backend
  const fetchPromocodes = () => {
    axios
      .get("/api/admins/promocodes") // Updated endpoint
      .then((response) => {
        setPromoCodesList(response.data); // Assuming response.data is an array of promo codes
      })
      .catch((error) => {
        console.error("Error fetching promo codes:", error);
        toast({
          title: "Error",
          description: "Unable to fetch promo codes.",
          variant: "destructive",
        });
      });
  };

  // Handle promo code generation
  const handleGenerate = () => {
    let isValid = true;

    if (promoCode.length < 3 || promoCode.length > 10) {
      setPromoCodeError("Promo code must be between 3 and 10 characters.");
      isValid = false;
    }

    if (amount < 1 || amount > 100) {
      setAmountError("Amount must be between 1 and 100.");
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);

    axios
      .post("/api/admins/createPromocode", {
        code: promoCode,
        amount: parseInt(amount, 10),
      })
      .then(() => {
        setPromoCode("");
        setAmount("");
        setPromoCodeError("");
        setAmountError("");
        toast({
          title: "Promo Code Generated",
          description: `The promo code "${promoCode}" has been successfully created.`,
        });
        fetchPromocodes(); // Refresh the promo codes list
      })
      .catch((error) => {
        console.error("Error generating promo code:", error);
        toast({
          title: "Error Generating Promo Code",
          description: error.response?.data?.message || "Something went wrong.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle promo code deletion
  const deleteClicked = (promo) => {
    axios
      .delete(`/api/admins/promocodes/${promo._id}`)
      .then(() => {
        toast({
          title: "Promo Code Deleted",
          description: `The promo code "${promo.code}" has been deleted.`,
        });
        fetchPromocodes(); // Refresh the promo codes list
      })
      .catch((error) => {
        console.error("Error deleting promo code:", error);
        toast({
          title: "Error Deleting Promo Code",
          description: error.response?.data?.message || "Something went wrong.",
          variant: "destructive",
        });
      });
  };

  // Validation for the first input
  const handlePromoCodeChange = (e) => {
    const value = e.target.value;
    setPromoCode(value);
    if (value.length >= 3 && value.length <= 10) {
      setPromoCodeError("");
    } else {
      setPromoCodeError("Promo code must be between 3 and 10 characters.");
    }
  };

  // Validation for the second input
  const handleAmountChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setAmount(value);

      if (value >= 1 && value <= 100) {
        setAmountError("");
      } else {
        setAmountError("Amount must be between 1 and 100.");
      }
    }
  };

  useEffect(() => {
    fetchPromocodes(); // Fetch promo codes on component mount
  }, []);

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <Card>
        <CardHeader>
          <CardTitle>Promo Code Generator</CardTitle>
          <CardDescription>
            Enter a promo code below and click "Generate" to process it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                value={promoCode}
                onChange={handlePromoCodeChange}
                placeholder="Enter promo code (3-10 characters)"
                className="border border-gray-300 rounded-md p-2 w-full"
                disabled={isLoading}
              />
              {promoCodeError && (
                <p className="text-red-500 text-sm">{promoCodeError}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter promo code amount (1-100)"
                className="border border-gray-300 rounded-md p-2 w-full"
                disabled={isLoading}
              />
              {amountError && (
                <p className="text-red-500 text-sm">{amountError}</p>
              )}
            </div>

            <button
              onClick={handleGenerate}
              className={`${
                isLoading ? "bg-yellow-400 cursor-not-allowed" : "bg-yellow-500"
              } text-white py-2 px-4 rounded-md hover:bg-yellow-600`}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Promo Codes</CardTitle>
          <CardDescription>A list of promo codes you have generated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of generated promo codes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Promo Code</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodesList.map((promo) => (
                <TableRow key={promo._id}>
                  <TableCell>{promo.code}</TableCell>
                  <TableCell>
                    <DeleteButton onConfirm={() => deleteClicked(promo)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
