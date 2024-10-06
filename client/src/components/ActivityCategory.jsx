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
import CreateDialog from "./CreateDialog"
import NewCategoryForm from "./forms/NewCategoryForm"
import { EditCategoryDialog } from "./EditCategory"
export default function ActivityCategory() {
    const deleteClicked = (id) => {
        console.log(id)
    }
    const activityCategories = [
        { id: 1, name: "food" }, { id: 2, name: "stand up comedy" }, { id: 3, name: "concert" }, { id: 4, name: "party" }]
    
    const CreateButton = ()=>{
        return(
            <CreateDialog title="Category" form={<NewCategoryForm />}/>
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
                            <EditCategoryDialog category={activity.name}/>
                        </TableCell>
                        <TableCell className="text-right">
                    <Button onClick={() => deleteClicked(account.id)} variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </TableCell>
                        
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )


}