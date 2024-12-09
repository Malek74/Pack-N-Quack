import { ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PropTypes from "prop-types";

MultiselectEventsDropdown.propTypes = {
  options: PropTypes.array,
  selectedOptions: PropTypes.array,
  setSelectedOptions: PropTypes.func,
};

export default function MultiselectEventsDropdown({
  options,
  selectedOptions,
  setSelectedOptions,
}) {
  const handleOptionToggle = (option) => {
    setSelectedOptions((prev) =>
      prev.some((item) => item._id === option._id)
        ? prev.filter((item) => item._id !== option._id)
        : [...prev, option]
    );
  };

  const removeOption = (optionId) => {
    setSelectedOptions((prev) => prev.filter((item) => item._id !== optionId));
  };

  return (
    <div className="flex flex-col items-start">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Select events
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel>Events</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option._id}
              checked={selectedOptions.some((item) => item._id === option._id)}
              onCheckedChange={() => handleOptionToggle(option)}
            >
              <span key={option._id} className="flex items-center">
                {option.name}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedOptions.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {selectedOptions.map((option) => (
            <Badge
              variant="secondary"
              key={option._id}
              className="flex items-center justify-between bg-gold py-1 pl-2 pr-1 text-white hover:bg-gold"
            >
              {option.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0"
                onClick={() => removeOption(option._id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
