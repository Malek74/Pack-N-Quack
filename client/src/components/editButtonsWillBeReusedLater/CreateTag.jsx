import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function CreateTag() {

    const [tags, setTags] = useState({});

    // useEffect(() => {
    const fetchTags = async () => {
        try {
            const response = await axios.get("/api/tags");
            setTags(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addTags = async (name, option) => {
        try {
            const response = await axios.post("/api/tags", {
                name: name,  // The name of the tag/category
                option: option  // The tag or option being added under this category
            });
            console.log(response.data);
            fetchTags();
        } catch (error) {
            console.error("Error adding tag:", error);
        }
    };


    // State to manage tags grouped by category


    // State to handle new tag input, selected category, and new category input
    const [newTag, setNewTag] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('New Category');
    const [newCategory, setNewCategory] = useState('');

    // Handle adding a new tag to the selected category
    const handleAddTag = () => {
        if (selectedCategory == 'New Category') {
            addTags(newCategory, newTag);
        } else {
            addTags(selectedCategory, newTag)
        }
        setNewTag(''); // Clear the input after adding
        setNewCategory('');

    };


    return (
        <Dialog>
            <DialogTrigger>
                <Button onClick={() => fetchTags()} variant="outline" className="w-min bg-gold hover:bg-goldhover hover:text-white text-white">
                    Create Tags
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Tags</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {/* Display Tags by Category */}
                    {Object.keys(tags).map((category) => (
                        <div key={category} className="mb-4">
                            <h3 className="font-bold">{category}:</h3>
                            <p>{tags[category].join(', ')}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    {/* Select Category to Add New Tag */}
                    <Label htmlFor="category" className="text-right">
                        Select Category:
                    </Label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border rounded w-max p-2"
                    >
                        {Object.keys(tags).map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                        <option value="New Category">
                            New Category
                        </option>
                    </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    <Label htmlFor="new-category" className="text-left">
                        Add New Category:
                    </Label>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="border rounded w-full p-2"
                        placeholder="Enter new category"
                    />
                    {/* <Button
                        className="w-min bg-gold hover:bg-goldhover text-white"
                        onClick={handleAddCategory}
                    >
                        Add Category
                    </Button> */}
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    <Label htmlFor="new-tag" className="text-left">
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
                        <Button type="submit" className="w-min bg-[#E7B008] hover:bg-[#b89319]">
                            Save changes
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
