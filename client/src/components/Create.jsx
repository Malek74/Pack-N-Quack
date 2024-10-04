import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function Create(props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-min bg-[#E7B008] text-white">{props.task}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{props.task}</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Activity Name:
                        </Label>
                        <Input
                            id="name"
                            defaultValue="Pedro Duarte"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                            Time & Date:
                        </Label>
                        <Input
                            id="time"
                            defaultValue="Oct 03 | 09:00pm"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                            Location:
                        </Label>
                        <Input
                            id="location"
                            defaultValue="Cairo"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pricw" className="text-right">
                            Price:
                        </Label>
                        <Input
                            id="price"
                            defaultValue="EGP 500"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category:
                        </Label>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category:
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-auto">{props.category}</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Category</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Food</DropdownMenuItem>
                                <DropdownMenuItem>StandUp Comedy</DropdownMenuItem>
                                <DropdownMenuItem>Concert</DropdownMenuItem>
                                <DropdownMenuItem>Theatre</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tags" className="text-right">
                            Tags:
                        </Label>
                        <Input
                            id="tags"
                            defaultValue="#Entertainment #Rap"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button type="submit" className="w-min bg-[#E7B008] hover:bg-[#b89319]">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
