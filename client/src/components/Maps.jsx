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
import GoogleMap from "./GoogleMap"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

export default function Maps(props) {

    return (
        <Dialog>
            <DialogTrigger><Label className="w-min text-black hover:text-gray-500 hover:underline">Open in Maps</Label></DialogTrigger>
            <DialogContent>
                <GoogleMap src={props.mapsSrc} className="w-auto"></GoogleMap>
                <DialogFooter>
                    <DialogClose>
                        <Button type="close" className="w-min bg-gold hover:bg-goldhover">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}