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

MultiselectDropdown.propTypes = {
  options: PropTypes.array,
  selectedOptions: PropTypes.array,
  setSelectedOptions: PropTypes.func,
};

export default function MultiselectDropdown({
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
            Select tags
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel>Tags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option._id}
              checked={selectedOptions.some((item) => item._id === option._id)}
              onCheckedChange={() => handleOptionToggle(option)}
            >
              <span key={option._id} className="flex items-center">
                {option.tag}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedOptions.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2 ">
          {selectedOptions.map((option) => (
            <Badge
              variant="secondary"
              key={option._id}
              className="pl-2 pr-1 py-1 bg-gold text-white flex justify-between items-center hover:bg-gold"
            >
              {option.tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
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
