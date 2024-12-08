import CheckoutForm from "@/components/forms/CheckoutForm";
import CartPage from "./CartPage";
import GuideButton from "@/components/guideComponents/popMessage";

export default function CheckoutPage() {
    return (
        <div className="flex flex-col w-screen p-14 pb-0">
            <CheckoutForm />
            < CartPage />

 <GuideButton guideMessage={"Ensure the quantities and items are correct, then proceed to payment"} />


        </div>
    );
}