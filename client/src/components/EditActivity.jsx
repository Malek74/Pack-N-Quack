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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import axios from "axios"
import { useEffect, useState } from "react"



export default function Edit(props) {
    const [categories, setCategories] = useState([]);

    useEffect(()=> {
        axios.get('https://k0gfbwb4-8000.euw.devtunnels.ms/api/activity/category').then((response) => {
            setCategories(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button ><Pencil /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{props.task}</DialogTitle>
                    <DialogDescription>
                        Make changes to you activity here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Activity Name:
                        </Label>
                        <Input
                            id="name"
                            defaultValue={props.name}
                            className="col-span-3"
                        />
                    </div>
                    {/* <Button className="bg-color-red" onclick={getCategories()}>getCategories</Button> */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                            Time & Date:
                        </Label>
                        <Input
                            id="time"
                            defaultValue={props.time}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                            Location:
                        </Label>
                        <Input
                            id="location"
                            defaultValue={props.location}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price:
                        </Label>
                        <Input
                            id="price"
                            defaultValue={props.price}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category:
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-auto">{props.category}</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Category</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {categories.map((category) => (
                                    <DropdownMenuItem key={category._id}>{category.name}</DropdownMenuItem>
                                ))}
                                {/* <DropdownMenuItem>Food</DropdownMenuItem>
                                <DropdownMenuItem>StandUp Comedy</DropdownMenuItem>
                                <DropdownMenuItem>Concert</DropdownMenuItem>
                                <DropdownMenuItem>Theatre</DropdownMenuItem> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tags" className="text-right">
                            Tags:
                        </Label>
                        <Input
                            id="tags"
                            defaultValue={props.tags}
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
