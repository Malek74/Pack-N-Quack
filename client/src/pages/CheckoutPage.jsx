import CheckoutForm from "@/components/forms/CheckoutForm";
import CartPage from "./CartPage";
import GuideButton from "@/components/guideComponents/popMessage";


import Delivery from "@/components/CheckOutPage/Delivery";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
export default function CheckoutPage() {
    const { prefCurrency } = useUser();
    const [paymentMethod, setPaymentMethod] = useState("card")
    const [WalletBallance, setWalletBallance] = useState(0);
    const [promoCode, setPromoCode] = useState("");
    const [addresses, setAddresses] = useState([]);
    const handleCheckout = async () => {
        try {
            const response = await axios.post(`/api/tourist/checkout`, {
                paymentMethod: paymentMethod,
                promoCode: promoCode,
                payByWallet: (paymentMethod === "wallet"),
                addresses: addresses

            });
            if (response.data.url) {
                window.location.href = response.data.url;
            }
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }


    const fetchWallet = async () => {
        try {
            const response = await axios.get(
                `/api/tourist/walletBalance/`
            );
            console.log(response.data)
            setWalletBallance(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };




    useEffect(() => {
        fetchWallet();
    }, []);




    return (
        <div className="grid grid-cols-2 p-14 pb-0 h-auto">
            <div className="w-screen/2  ">
                <Delivery addresses={addresses} setAddresses={setAddresses} />
                <div className="flex justify-between items-center mt-10">
                    <Label className="text-lg font-semibold">Wallet Balance:</Label>
                    <p className="text-3xl font-bold text-green-600">{prefCurrency}{WalletBallance}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                    <Label className="text-lg font-semibold mb-3 block">Choose Payment Method:</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200 transition-all hover:border-blue-500">
                            <RadioGroupItem value="wallet" id="wallet" />
                            <Label htmlFor="wallet" className="flex-grow cursor-pointer">
                                <span className="font-medium">Pay by Wallet</span>
                                <p className="text-sm text-gray-500">Use your available balance</p>
                            </Label>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200 transition-all hover:border-blue-500">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex-grow cursor-pointer">
                                <span className="font-medium">Pay by Card</span>
                                <p className="text-sm text-gray-500">Use your credit or debit card</p>
                            </Label>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200 transition-all hover:border-blue-500">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash" className="flex-grow cursor-pointer">
                                <span className="font-medium">Pay by Cash</span>
                                <p className="text-sm text-gray-500">Cash on Delivery</p>
                            </Label>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </RadioGroup>
                </div>


                <div className="mb-6 mt-6">
                    <Label htmlFor="promoCode" className="text-lg font-semibold mb-2">
                        Got a Promo Code?
                    </Label>
                    <div className="flex">
                        <Input
                            id="promoCode"
                            placeholder="Enter your promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-grow mr-2"
                        />
                    </div>
                </div>

 <GuideButton guideMessage={"Ensure the quantities and items are correct, then proceed to payment"} />


            </div>
            <div className="w-min h-full justify-between" >
                < CartPage />
                <div className="flex justify-end items-end">
                    <Button className="mr-20 mb-12 w-40 h-12 text-xl hover:bg-goldhover bg-gold " onClick={handleCheckout}>Checkout</Button>
                </div>
            </div>
        </div>
    );
}
