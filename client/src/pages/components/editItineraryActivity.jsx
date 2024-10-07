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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

                        <Label htmlFor="name" className="text-right">
                            Description:
                        </Label>
                        <Input
                            id="description"
                            defaultValue={props.description}
                            className="col-span-3"
                        />
                    </div>
                    {/* <Button className="bg-color-red" onclick={getCategories()}>getCategories</Button> */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                            Start Time:
                        </Label>
                        <Input
                            id="start-time"
                            type = "time"
                            defaultValue={props.startTime}
                            className="col-span-3"
                        />
                        <Label htmlFor="time" className="text-right">
                            End Time:
                        </Label>
                        <Input
                            id="end-time"
                            type = "time"
                            defaultValue={props.endTime}
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
