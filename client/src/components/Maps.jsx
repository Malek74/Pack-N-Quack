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
import MapsApp from "./MapsApp"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

export default function Maps() {
   
        return (
            <Dialog>
                <DialogTrigger><Label className="w-min text-black hover:text-gray-500 hover:underline">Open in Maps</Label></DialogTrigger>
                <DialogContent>
                    <MapsApp></MapsApp>
                    <DialogFooter>
                        <DialogClose>
                            <Button type="close" className="w-min bg-[#E7B008] hover:bg-[#b89319]">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        )
    }