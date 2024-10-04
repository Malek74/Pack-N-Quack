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

import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"

export default function CreateTags() {
    return (
        <Dialog>
            <DialogTrigger><Button variant="outline" className="w-min bg-[#E7B008] text-white">Create Tags</Button></DialogTrigger>
            <DialogContent>
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
            <DialogFooter>
                <DialogClose>
                    <Button type="submit" className="w-min bg-[#E7B008] hover:bg-[#b89319]">Save changes</Button>
                </DialogClose>
            </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}