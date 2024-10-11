/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { Button } from "../ui/button"

export default function ImagesScroll(props) {

    return (
        <Dialog>
            <DialogTrigger><Label className="w-min text-black hover:text-gray-500 underline">View More Pictures</Label></DialogTrigger>
            <DialogContent className="sm:max-w-auto max-h-[80vh] overflow-y-auto">

                {Array.isArray(props.pictures) && props.pictures.map((picture, index) => (
                    <div key={index}>
                        <img src={picture} alt="" />
                    </div>
                ))}

                <DialogFooter>
                    <DialogClose>
                        <Button type="close" className="w-min bg-gold hover:bg-goldhover">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}