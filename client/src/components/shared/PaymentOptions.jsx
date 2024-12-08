import { CreditCard, Wallet } from "lucide-react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const PaymentOption = ({ id, title, description, icon: Icon, isSelected }) => (
  <div className="relative">
    <RadioGroupItem id={id} value={id} className="sr-only peer" />
    <Label htmlFor={id} className="block cursor-pointer">
      <Card
        className={`w-full max-w-md transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-primary  ${
          isSelected ? "border-primary" : "hover:border-primary/50"
        }`}
      >
        <CardHeader>
          <div className="flex items-center gap-4">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isSelected ? "border-primary" : "border-input"
              }`}
            >
              {isSelected && (
                <div className="w-3 h-3 rounded-full bg-primary" />
              )}
            </div>
            <CardTitle className="flex items-center gap-2">
              <Icon
                className={
                  isSelected ? "text-primary" : "text-muted-foreground"
                }
              />
              {title}
            </CardTitle>
          </div>
          <CardDescription className="ml-9">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Label>
  </div>
);

PaymentOption.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

PaymentOptions.propTypes = {
  selectedOption: PropTypes.string.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
};
export default function PaymentOptions({ selectedOption, setSelectedOption }) {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Choose Payment Method</h2>
      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
        <div className="">
          <PaymentOption
            id="wallet"
            title="Pay by Wallet"
            description="Use your digital wallet"
            icon={Wallet}
            isSelected={selectedOption === "wallet"}
          />
          <PaymentOption
            id="card"
            title="Pay by Card"
            description="Use your credit or debit card"
            icon={CreditCard}
            isSelected={selectedOption === "card"}
          />
        </div>
      </RadioGroup>
    </div>
  );
}
