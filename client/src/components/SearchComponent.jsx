import { Input } from "./ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SearchComponent() {
    return (
        <div className="flex">
            <Input placeholder="Search" className="w-80"></Input>
            <Select className="absolute">
                <SelectTrigger className="w-max">
                    <SelectValue placeholder="Search By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Tag">Tag</SelectItem>
                    <SelectItem value="Name">Name</SelectItem>
                    <SelectItem value="Category">Category</SelectItem>

                </SelectContent>
            </Select>


        </div>
    )
}