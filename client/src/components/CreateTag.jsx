import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import Multiselect from "multiselect-react-dropdown";

import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";

export default function CreateTag() {
    // State to manage the options list
    const [options, setOptions] = useState([
        'Monuments',
        'Museums',
        'Religious Sites',
        'Palaces',
        'Castles'
    ]);

    // State to handle the new tag input
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag && !options.includes(newTag)) {
            setOptions([...options, newTag]);
            setNewTag(''); // Clear the input after adding
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline" className="w-min bg-gold hover:bg-goldhover hover:text-white text-white">Create Tags</Button>
            </DialogTrigger>
            <DialogContent>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tags" className="text-right">
                        Tags:
                    </Label>
                    <Multiselect
                        className="w-min"
                        isObject={false}
                        onKeyPressFn={function noRefCheck() { }}
                        onRemove={function noRefCheck() { }}
                        onSearch={function noRefCheck() { }}
                        onSelect={function noRefCheck() { }}
                        options={options}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    <Label htmlFor="new-tag" className="text-right">
                        Add New Tag:
                    </Label>
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="border rounded w-full p-2"
                        placeholder="Enter new tag"
                    />
                    <Button
                        className="w-min bg-gold hover:bg-goldhover text-white"
                        onClick={handleAddTag}
                    >
                        Add Tag
                    </Button>
                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button type="submit" className="w-min bg-[#E7B008] hover:bg-[#b89319]">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
