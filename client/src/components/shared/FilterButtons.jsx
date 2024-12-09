/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterButtons({
  buttons = [],
  categories,
  onFilterChange,
  marketplace,
}) {
  const handleSelectChange = (type, value) => {
    if (onFilterChange) {
      onFilterChange(type, value); // Notify the parent of the selected value
    }
  };

  return (
    <section
      className={`${marketplace ? " " : "mb-20"} flex gap-2 ${
        marketplace ? "justify-between" : ""
      }`}
    >
      {buttons.length > 0 ? (
        buttons.map((button, index) => (
          <Select
            key={index}
            onValueChange={(value) => handleSelectChange(button.type, value)}
          >
            <SelectTrigger variant="ghost" className="w-auto border-none">
              <SelectValue placeholder={button.type} />
            </SelectTrigger>
            <SelectContent>
              {button.type === "Category"
                ? categories.map((category, idx) => (
                    <SelectItem key={idx} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                : button.options.map((option, idx) => (
                    <SelectItem key={idx} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        ))
      ) : (
        <p>No buttons available</p>
      )}
    </section>
  );
}
