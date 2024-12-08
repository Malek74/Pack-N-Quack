import CheckoutForm from "@/components/forms/CheckoutForm";
import CartPage from "./CartPage";
import Delivery from "@/components/CheckOutPage/Delivery";
export default function CheckoutPage() {
    return (
        <div className="grid grid-cols-2 p-14 pb-0">
            <div className="w-screen/2">
                <Delivery />
            </div>
            <div className="">
                < CartPage />
            </div>
        </div>
    );
}