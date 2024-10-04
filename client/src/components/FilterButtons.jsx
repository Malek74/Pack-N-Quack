import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function FilterButtons() {
    return (
        <>
            <Select>
                <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Price Low To High">Price Low To High</SelectItem>
                    <SelectItem value="Price High To Low">Price High To Low</SelectItem>
                    <SelectItem value="Ratings Low To High">Ratings Low To High</SelectItem>
                    <SelectItem value="Ratings High To Low">Ratings High To Low</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Price Low To High">Price Low To High</SelectItem>
                    <SelectItem value="Price High To Low">Price High To Low</SelectItem>
                    <SelectItem value="Ratings Low To High">Ratings Low To High</SelectItem>
                    <SelectItem value="Ratings High To Low">Ratings High To Low</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Price Low To High">Price Low To High</SelectItem>
                    <SelectItem value="Price High To Low">Price High To Low</SelectItem>
                    <SelectItem value="Ratings Low To High">Ratings Low To High</SelectItem>
                    <SelectItem value="Ratings High To Low">Ratings High To Low</SelectItem>
                </SelectContent>
            </Select>

        </>
    )
}
