/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function EditTag({ initialTags, onTagsChange }) {
    const [tags, setTags] = useState({});
    const [currentTags, setCurrentTags] = useState(initialTags); // State to manage the current tags list

    // Fetch tags from the server when the component mounts
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get("/api/tags");
                setTags(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTags();
    }, []);

    // State to handle new tag input and selected category
    const [newTag, setNewTag] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(Object.keys(tags)[0] || '');

    // Handle adding a new tag to the current tags list
    const handleAddTag = () => {
        if (newTag && selectedCategory) {
            // Create a new tag object
            const tagToAdd = {
                name_tag: selectedCategory,
                option: newTag,
            };

            // Update the current tags state
            setCurrentTags((prevTags) => [...prevTags, tagToAdd]);
            setNewTag(''); // Clear the input after adding
        }
    };

    // Handle removing a tag from the current tags list
    const handleRemoveTag = (tagToRemove) => {
        setCurrentTags((prevTags) => prevTags.filter(tag => tag.name_tag !== tagToRemove.name_tag));
    };
    const handleSave = () => {
        console.log(currentTags);
        onTagsChange(currentTags);

    };
    return (
        <Dialog>
            <DialogTrigger>
                <Label className="w-min text-black hover:text-gray-500 underline">Edit Tags</Label>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Tags</DialogTitle>
                </DialogHeader>

                <div>
                    <h3>Current Tags:</h3>
                    {currentTags.map((tag) => (
                        <div key={tag.name_tag} className="flex justify-between">
                            <p>{`#${tag.name_tag}-${tag.option}`}  </p>
                            <Button
                                onClick={() => handleRemoveTag(tag)}
                                variant="ghost"
                                className="text-red-500"
                            >
                                Remove
                            </Button>
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
                    </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    <Label htmlFor="new-tag" className="text-left">
                        Select Tag:
                    </Label>
                    <select
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="border rounded w-full p-2"
                    >
                        <option value="">Select a tag</option>
                        {Array.isArray(tags[selectedCategory]) && tags[selectedCategory].map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                    <Button
                        className="w-min bg-gold hover:bg-goldhover text-white"
                        onClick={handleAddTag}
                    >
                        Add Tag
                    </Button>
                </div>

                <DialogFooter>
                    <DialogClose>
                        <Button onClick={() => handleSave()} type="submit" className="w-min bg-[#E7B008] hover:bg-[#b89319]">
                            Save changes
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
