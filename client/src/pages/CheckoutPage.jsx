import CheckoutForm from "@/components/forms/CheckoutForm";
import CartPage from "./CartPage";

export default function CheckoutPage() {
    return (
        <div className="flex flex-col w-screen p-14 pb-0">
            <CheckoutForm />
            < CartPage />

        </div>
    );
}