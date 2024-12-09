import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FilterPanel({ filters, setFilters, fetchFilters }) {
  const [availableFilters, setAvailableFilters] = useState({});

  useEffect(() => {
    if (fetchFilters) {
      const fetchData = async () => {
        try {
          const data = await fetchFilters();
          setAvailableFilters(data);
        } catch (err) {
          console.error("Error fetching filters:", err);
        }
      };
      fetchData();
    }
  }, [fetchFilters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {filters.map((filter) => (
        <div key={filter.type} className="flex flex-col gap-2">
          <label className="text-sm font-medium">{filter.label}</label>
          {filter.type === "dropdown" && (
            <Select onValueChange={(value) => handleFilterChange(filter.key, value)}>
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
          {filter.type === "range" && filter.component}
        </div>
      ))}
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
      component: PropTypes.node,
    })
  ).isRequired,
  setFilters: PropTypes.func.isRequired,
  fetchFilters: PropTypes.func,
};
