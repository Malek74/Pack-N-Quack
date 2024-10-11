import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Validation schemas
const categorySchema = z.object({
    name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
});

const tagSchema = z.object({
    name: z.string().min(2, { message: "Tag name must be at least 2 characters." }),
});

export default function ActivityManager() {
    const deleteClicked = (id) => {
        console.log(id);
    };

    const activityCategories = [
        { id: 1, name: "food" },
        { id: 2, name: "stand up comedy" },
        { id: 3, name: "concert" },
        { id: 4, name: "party" },
    ];

    const activityTags = [
        { id: 1, name: "historic areas" },
        { id: 2, name: "beaches" },
        { id: 3, name: "family-friendly" },
        { id: 4, name: "shopping" },
    ];

    // State to track which form to display
    const [isTagForm, setIsTagForm] = React.useState(false);

    // React Hook Form for creating new category/tag
    const createForm = useForm({
        resolver: zodResolver(isTagForm ? tagSchema : categorySchema),
        defaultValues: { name: "" },
    });

    const onSubmitCreate = (data) => {
        if (isTagForm) {
            console.log("New Activity Tag Created: ", data);
        } else {
            console.log("New Activity Category Created: ", data);
        }
        createForm.reset(); // Clear form after submission
    };

    const CreateButton = () => {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setIsTagForm(false)}> Add Activity Category</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setIsTagForm(true)}> Add Activity Tag</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{isTagForm ? "Create a new activity tag" : "Create a new activity category"}</DialogTitle>
                        <DialogDescription>
                            {isTagForm ? "Add a new activity tag. Click create when you're done." : "Add a new activity category. Click create when you're done."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                {isTagForm ? "Tag name" : "Category name"}
                            </Label>
                            <Input
                                id="name"
                                {...createForm.register("name")}
                                className="col-span-3"
                            />
                            {createForm.formState.errors.name && (
                                <p className="text-red-500 col-span-4">
                                    {createForm.formState.errors.name.message}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    const EditButton = (props) => {
        const editForm = useForm({
            resolver: zodResolver(isTagForm ? tagSchema : categorySchema),
            defaultValues: { name: props.default },
        });

        const onSubmitEdit = (data) => {
            if (isTagForm) {
                console.log("Updated Tag: ", data);
            } else {
                console.log("Updated Category: ", data);
            }
        };

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Update</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{isTagForm ? "Update Tag" : "Update Category"}</DialogTitle>
                        <DialogDescription>
                            {isTagForm ? "Edit the activity tag. Click update when you're done." : "Edit the activity category. Click update when you're done."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                {isTagForm ? "Tag name" : "Category name"}
                            </Label>
                            <Input
                                id="name"
                                {...editForm.register("name")}
                                className="col-span-3"
                            />
                            {editForm.formState.errors.name && (
                                <p className="text-red-500 col-span-4">
                                    {editForm.formState.errors.name.message}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit">Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Activity Manager</h2>
            <Table>
                <TableCaption>A list of activity categories.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead></TableHead>
                        <TableHead className="text-right">
                            <CreateButton />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activityCategories.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.id}</TableCell>
                            <TableCell>{activity.name}</TableCell>
                            <TableCell>
                                <EditButton default={activity.name} />
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    onClick={() => deleteClicked(activity.id)}
                                    variant="destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Category
                                    </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
           
