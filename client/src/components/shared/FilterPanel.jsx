import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function FilterPanel({ filters, onApply }) {
  const [localFilters, setLocalFilters] = useState({});

  useEffect(() => {
    // Initialize localFilters with default values
    const initialFilters = {};
    filters.forEach((filter) => {
      if (filter.type === "range") {
        initialFilters[filter.key] = filter.defaultValue || [0, 100000000];
      } else if (filter.type === "dropdown") {
        initialFilters[filter.key] = "";
      }
    });
    setLocalFilters(initialFilters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApply(localFilters); // Pass local filters to parent
  };

  return (
    <div className="flex flex-col gap-4">
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col gap-2">
          <label className="text-sm font-medium">{filter.label}</label>
          {filter.type === "dropdown" && (
            <Select
              onValueChange={(value) => handleFilterChange(filter.key, value)}
              value={localFilters[filter.key] || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {filter.type === "range" &&
            filter.component({
              priceRange: localFilters[filter.key],
              handlePriceChange: (newRange) =>
                handleFilterChange(filter.key, newRange),
            })}
        </div>
      ))}
      <Button onClick={handleApplyFilters} className="mt-4 self-end">
        Apply
      </Button>
    </div>
  );
}

FilterPanel.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.array,
      defaultValue: PropTypes.any,
      component: PropTypes.func, // Now a function for dynamic rendering
    })
  ).isRequired,
  onApply: PropTypes.func.isRequired,
};
