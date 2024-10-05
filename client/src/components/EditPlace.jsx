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

import Multiselect from "multiselect-react-dropdown"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import axios from "axios"
import { useEffect, useState } from "react"



export default function Edit(props) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
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
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Historical Place Name:
                        </Label>
                        <Input
                            id="name"
                            defaultValue={props.name}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Description:
                        </Label>
                        <Input
                            id="name"
                            defaultValue={props.description}
                            className="col-span-3"
                        />
                    </div>
                    {/* <Button className="bg-color-red" onclick={getCategories()}>getCategories</Button> */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                            Opening Hours:
                        </Label>
                        <Input
                            id="openingHours"
                            defaultValue={props.hours}
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
                            Price for Egyptians:
                        </Label>
                        <Input
                            id="priceForEgyptians"
                            defaultValue={props.Eprice}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price for Foreigners:
                        </Label>
                        <Input
                            id="priceForForeigners"
                            defaultValue={props.Fprice}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tags" className="text-right">
                            Tags:
                        </Label>
                        <Multiselect className="w-min"
                            isObject={false}
                            onKeyPressFn={function noRefCheck() { }}
                            onRemove={function noRefCheck() { }}
                            onSearch={function noRefCheck() { }}
                            onSelect={function noRefCheck() { }}
                            options={[
                                'Monuments',
                                'Museums',
                                'Religious Sites',
                                'Palaces',
                                'Castles'

                            ]}
                        />
                    </div>
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tags" className="text-right">
                            Tags:
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-auto">{props.tags}</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Tags</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Monuments</DropdownMenuItem>
                                <DropdownMenuItem>Museums</DropdownMenuItem>
                                <DropdownMenuItem>Religious Sites</DropdownMenuItem>
                                <DropdownMenuItem>Palaces</DropdownMenuItem>
                                <DropdownMenuItem>Castles</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div> */}
                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button type="submit" className="w-min bg-gold hover:bg-goldhover">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
