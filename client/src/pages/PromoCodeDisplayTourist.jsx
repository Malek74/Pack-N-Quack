import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function PromoCodeCard() {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState(null);

  const fetchPromoCode = async () => {
    try {
      const response = await axios.get("/api/tourist/myPromoCodes");
      setPromoCode(response.data);
      console.log(promoCode);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch promo code.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPromoCode();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `Promo code "${code}" copied to clipboard.`,
      variant: "success",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Promo code</CardTitle>
        <CardDescription>Use this promo code for a discount on your next purchase or trip.</CardDescription>
      </CardHeader>
      <CardContent>
        {promoCode ? (
          <div className="flex flex-col space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Promo Code:</p>
              <p className="text-2xl font-bold">{promoCode.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Discount:</p>
              <p className="text-lg">{promoCode.amount}% Off</p>
            </div>
            
           <Button
              onClick={() => handleCopy(promoCode.code)}
              className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
           >
          Copy Code
            </Button>

          </div>
        ) : (
          <p className="text-gray-500">No promo code available at the moment.</p>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Birthday promo code is valid for 7 days only!! Terms and conditions apply.
        </p>
      </CardFooter>
    </Card>
  );
}

