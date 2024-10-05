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
import Multiselect from "multiselect-react-dropdown"
import BasicDateTimePicker from "./BasicDateTimePicker"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { useEffect, useState } from "react"
export default function Create(props) {
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
                <Button variant="outline" className="w-min bg-gold hover:bg-goldhover hover:text-white text-white">Create a new Activity</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new Activity</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Activity Name:
                        </Label>
                        <Input
                            id="name"
                            placeholder="Activity Name"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                            Time & Date:
                        </Label>
                        <span className="w-max">
                            <BasicDateTimePicker ></BasicDateTimePicker>
                        </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                            Location:
                        </Label>
                        <Input
                            id="location"
                            placeholder="Cairo"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mapsSource" className="text-right">
                            Google Maps Link:
                        </Label>
                        <Input
                            id="maps"
                            placeholder={props.googlemaps}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price:
                        </Label>
                        <Input
                            id="price"
                            placeholder="EGP 500"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category:
                        </Label>
                        <Select>
                            <SelectTrigger className="w-max">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* {categories.map((category) => (
                                    <SelectItem value={category.name} key={category._id}>{category.name}</SelectItem>
                                ))} */}
                                <SelectItem value="Concert">Concert</SelectItem>
                                <SelectItem value="Theatre">Theatre</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tags" className="text-right">
                            Tags:
                        </Label>
                        <Multiselect className="w-max"
                            isObject={false}
                            onKeyPressFn={function noRefCheck() { }}
                            onRemove={function noRefCheck() { }}
                            onSearch={function noRefCheck() { }}
                            onSelect={function noRefCheck() { }}
                            options={[
                                'Concert',
                                'Entertainment',
                                'Theatre',

                            ]}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="booking" className="text-right">
                            Booking:
                        </Label>
                        <Select>
                            <SelectTrigger className="w-max">
                                <SelectValue placeholder="Is booking open?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>

                            </SelectContent>
                        </Select>

                    </div>
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
