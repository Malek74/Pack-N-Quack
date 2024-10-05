import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Define the component to accept an array of buttons with type and options
export default function FilterButtons({ buttons = [] }) {
    return (
        <section className="flex mb-20 gap-2">
            {/* Check if buttons array exists and map through it */}
            {buttons.length > 0 ? (
                buttons.map((button, index) => (
                    <Select key={index}>
                        <SelectTrigger variant="ghost" className="w-auto border-none">
                            <SelectValue placeholder={button.type} />
                        </SelectTrigger>
                        <SelectContent>
                            {button.options.map((option, idx) => (
                                <SelectItem key={idx} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))
            ) : (
                <p>No buttons available</p> // Fallback UI if no buttons are passed
            )}
        </section>
    );
}
