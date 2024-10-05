import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function ActivityCategory() {
    const deleteClicked = (id) => {
        console.log(id)
    }
    const activityCategories = [
        { id: 1, name: "food" }, { id: 2, name: "stand up comedy" }, { id: 3, name: "concert" }, { id: 4, name: "party" }]
        
    const CreateButton = ()=>{
        return(
            <Dialog>
            <DialogTrigger asChild>
            <Button variant="outline"> Add Activity Category</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create a new activity category</DialogTitle>
                <DialogDescription>
                    Add a new activity category. Click create when you're done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Activity name" className="text-right">
                            Category name
                            </Label>
                            <Input
                                id="Category name"
                                defaultValue=""
                                className="col-span-3"
                            />
                        </div>
                        
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
            

        </DialogContent>
    </Dialog>

    )    
  
        
    }    
        
    const EditButton = (props) => {
        return (
            
            
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Update </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update </DialogTitle>
                        <DialogDescription>
                            Edit the activity category. Click update when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Category name
                            </Label>
                            <Input
                                id="Category name"
                                defaultValue={props.default} 
                                className="col-span-3"
                            />
                        </div>
                        
                    </div>
                    <DialogFooter>
                        <Button type="submit">Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
        )
    }

    return (
        <Table>
            <TableCaption>A list of activity categories.</TableCaption>
            <TableHeader>
            <TableCell>
                            <CreateButton default/>
                        </TableCell>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead></TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            
                {activityCategories.map((activity) => (
                        
                    <TableRow key={activity.id}>
                        
                        <TableCell className="font-medium">{activity.id}</TableCell>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell>
                            <EditButton default={activity.name}/>
                        </TableCell>
                        <TableCell className="text-right">
                    <Button onClick={() => deleteClicked(account.id)} variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                    </Button>
                </TableCell>
                        
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )


}