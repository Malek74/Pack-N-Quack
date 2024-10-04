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
export default function Create(props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-min bg-[#E7B008] text-white  hover:bg-[#b89319] hover:text-white">Create a new Place</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new Place</DialogTitle>

                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Historical Place:
                        </Label>
                        <Input
                            id="name"
                            defaultValue="Pedro Duarte"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Description:
                        </Label>
                        <Input
                            id="name"
                            defaultValue="A brief about the place"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                            Opening Hours:
                        </Label>
                        <Input
                            id="OpeningHours"
                            defaultValue="7:00 am - 6:00 pm every day"
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
                        <Label htmlFor="price" className="text-right">
                            Price for Egyptians:
                        </Label>
                        <Input
                            id="price"
                            defaultValue="Adult: EGP 60, Student: EGP 30"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price for Foreigners:
                        </Label>
                        <Input
                            id="price"
                            defaultValue="Adult: €10 , Student: €5"
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

                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button type="submit" className="w-min bg-[#E7B008] hover:bg-[#b89319]">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
