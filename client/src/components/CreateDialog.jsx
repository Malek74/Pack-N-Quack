import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"


export default function CreateDialog({ title, form }) {
    return (
        <Dialog>

            <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-goldhover text-white hover:text-white" variant="outline"> Add {title}</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create a new {title}</DialogTitle>
                    <DialogDescription>
                        Add a new {title}. Click create when you're done.
                    </DialogDescription>
                </DialogHeader>
                {form}
            </DialogContent>

        </Dialog>

    )
}