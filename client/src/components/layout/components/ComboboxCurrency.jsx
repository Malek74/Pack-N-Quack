"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/context/UserContext";

export function ComboboxCurrency() {
  const { prefCurrency, updatePrefCurrency } = useUser();
  const [open, setOpen] = React.useState(false);
  const [currencies, setCurrencies] = React.useState([]);

  React.useEffect(() => {
    // Fetch currency list from API
    axios
      .get("/api/currencies")
      .then((response) => {
        setCurrencies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching currencies:", error);
      });
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100px] justify-between"
        >
          {prefCurrency
            ? currencies.find((currency) => currency[0] === prefCurrency)?.[0] || "EGP"
            : "Select currency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency[0]}
                  value={currency[0]}
                  onSelect={(currentValue) => {
                    updatePrefCurrency(
                      currentValue === prefCurrency ? "EGP" : currentValue
                    ); // Update context and localStorage
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      prefCurrency === currency[0] ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {currency[0]} - {currency[1]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboboxCurrency;
